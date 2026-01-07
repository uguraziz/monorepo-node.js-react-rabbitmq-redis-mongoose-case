import { useState, useMemo, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { getSocket } from '../../../lib/socket.js';
import { useAuthStore } from '../../../store/auth.store.js';
import { tasksApi } from '../../../api/tasks.api.js';
import { projectsApi } from '../../../api/projects.api.js';
import { EmptyState } from '../../../components/common/empty-state.jsx';
import { Button } from '../../../components/ui/button.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.jsx';
import { Input } from '../../../components/ui/input.jsx';

const statusLabels = {
  'todo': 'Yapılacak',
  'in-progress': 'Devam Ediyor',
  'done': 'Tamamlandı',
};

export const ProjectTable = ({ projectId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { accessToken } = useAuthStore();

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', { projectId }],
    queryFn: () => tasksApi.getAll({ projectId }),
  });

  const { data: projectData } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
      setEditingCell(null);
      setEditValue('');
    },
  });

  const tasks = tasksData?.data || [];
  const project = projectData;
  const projectMembers = project?.members || [];
  const owner = project?.ownerId ? [project.ownerId] : [];
  const users = useMemo(() => {
    return [...owner, ...projectMembers].filter((user, index, self) => 
      index === self.findIndex((u) => u._id === user._id || u._id?.toString() === user._id?.toString())
    );
  }, [owner, projectMembers]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter && task.status !== statusFilter) return false;
      if (assigneeFilter && task.assigneeId?._id !== assigneeFilter && task.assigneeId !== assigneeFilter) return false;
      if (tagFilter && (!task.tags || !Array.isArray(task.tags) || !task.tags.includes(tagFilter))) return false;
      return true;
    });
  }, [tasks, statusFilter, assigneeFilter, tagFilter]);

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    tasks.forEach((task) => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [tasks]);

  useEffect(() => {
    if (!accessToken || !projectId) return;

    const socket = getSocket(accessToken);
    
    socket.emit('task:subscribe', projectId);

    const handleTaskUpdate = (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
    };

    socket.on('task.updated', handleTaskUpdate);
    socket.on('task.created', handleTaskUpdate);
    socket.on('task.deleted', handleTaskUpdate);
    socket.on('comment.added', handleTaskUpdate);

    return () => {
      socket.off('task.updated', handleTaskUpdate);
      socket.off('task.created', handleTaskUpdate);
      socket.off('task.deleted', handleTaskUpdate);
      socket.off('comment.added', handleTaskUpdate);
      socket.emit('task:unsubscribe', projectId);
    };
  }, [accessToken, projectId, queryClient]);

  const handleCellClick = useCallback((task, field, e) => {
    e.stopPropagation();
    setEditingCell(`${task._id}-${field}`);
    setEditValue(field === 'status' ? task.status : field === 'assigneeId' ? (task.assigneeId?._id || task.assigneeId || '') : task[field] || '');
  }, []);

  const handleSave = useCallback((task, field) => {
    if (field === 'title' && !editValue.trim()) {
      setEditingCell(null);
      return;
    }
    
    const updateData = {};
    if (field === 'assigneeId') {
      updateData.assigneeId = editValue || null;
    } else {
      updateData[field] = editValue;
    }
    
    updateMutation.mutate({ id: task._id, data: updateData });
  }, [editValue, updateMutation]);

  const handleCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Başlık',
      cell: ({ row }) => {
        const task = row.original;
        const cellId = `${task._id}-title`;
        const isEditing = editingCell === cellId;
        
        if (isEditing) {
          return (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(task, 'title')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(task, 'title');
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
                className="h-8"
              />
            </div>
          );
        }
        return (
          <div
            className="cursor-pointer hover:underline"
            onClick={(e) => handleCellClick(task, 'title', e)}
          >
            {task.title}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const task = row.original;
        const cellId = `${task._id}-status`;
        const isEditing = editingCell === cellId;
        
        if (isEditing) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  updateMutation.mutate({ id: task._id, data: { status: value } });
                }}
              >
                <SelectTrigger className="w-[150px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Yapılacak</SelectItem>
                  <SelectItem value="in-progress">Devam Ediyor</SelectItem>
                  <SelectItem value="done">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        }
        return (
          <div
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
            onClick={(e) => handleCellClick(task, 'status', e)}
          >
            {statusLabels[task.status] || task.status}
          </div>
        );
      },
    },
    {
      accessorKey: 'assigneeId',
      header: 'Atanan',
      cell: ({ row }) => {
        const task = row.original;
        const cellId = `${task._id}-assigneeId`;
        const isEditing = editingCell === cellId;
        const assigneeId = task.assigneeId?._id || task.assigneeId;
        const assigneeName = task.assigneeId?.email || task.assigneeId?.name || 'Atanmamış';
        
        if (isEditing) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Select
                value={editValue || 'none'}
                onValueChange={(value) => {
                  const actualValue = value === 'none' ? '' : value;
                  setEditValue(actualValue);
                  updateMutation.mutate({ id: task._id, data: { assigneeId: actualValue || null } });
                }}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Kişi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Atanmamış</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        return (
          <div
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
            onClick={(e) => handleCellClick(task, 'assigneeId', e)}
          >
            {assigneeName}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'İşlemler',
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                  deleteMutation.mutate(task._id);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              Sil
            </Button>
          </div>
        );
      },
    },
  ], [editingCell, editValue, users, deleteMutation, updateMutation, handleCellClick, handleSave, handleCancel]);

  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  if (isLoading) {
    return <div className="py-8 text-center">Yükleniyor...</div>;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="Henüz görev yok"
        description="Bu projeye henüz görev eklenmemiş. İlk görevi eklemek için yukarıdaki 'Görev Ekle' butonunu kullanın."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center flex-wrap">
          <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tüm Durumlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="todo">Yapılacak</SelectItem>
              <SelectItem value="in-progress">Devam Ediyor</SelectItem>
              <SelectItem value="done">Tamamlandı</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter || 'all'} onValueChange={(value) => setAssigneeFilter(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tüm Kişiler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kişiler</SelectItem>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {allTags.length > 0 && (
            <Select value={tagFilter || 'all'} onValueChange={(value) => setTagFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tüm Etiketler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Etiketler</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(statusFilter || assigneeFilter || tagFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('');
                setAssigneeFilter('');
                setTagFilter('');
              }}
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Kolonlar:</span>
          {table.getAllColumns()
            .filter((column) => column.getCanHide() && column.id !== 'actions')
            .map((column) => (
              <label key={column.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={(e) => column.toggleVisibility(e.target.checked)}
                  className="rounded border-gray-300"
                />
                {typeof column.columnDef.header === 'string' 
                  ? column.columnDef.header 
                  : column.id}
              </label>
            ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="Filtreye uygun görev bulunamadı"
          description="Seçtiğiniz filtrelere uygun görev bulunmuyor. Filtreleri temizleyip tekrar deneyin."
        />
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-2 text-left">
                        {header.isPlaceholder ? null : (
                          <div
                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/tasks/${row.original._id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} kayıt
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Sonraki
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

