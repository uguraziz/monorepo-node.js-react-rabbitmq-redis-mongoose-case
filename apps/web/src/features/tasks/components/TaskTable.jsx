import { DataTable } from '../../../components/common/data-table.jsx';

export const TaskTable = ({ tasks, onRowClick }) => {
  const columns = [
    {
      accessorKey: 'title',
      header: 'Başlık',
    },
    {
      accessorKey: 'status',
      header: 'Durum',
    },
    {
      accessorKey: 'assigneeId',
      header: 'Atanan',
    },
  ];
  
  return (
    <DataTable
      columns={columns}
      data={tasks}
      onRowClick={onRowClick}
    />
  );
};

