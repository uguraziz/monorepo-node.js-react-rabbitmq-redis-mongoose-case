import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../../api/tasks.api.js';
import { usersApi } from '../../../api/users.api.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.jsx';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Görev başlığı gereklidir')
    .min(1, 'Görev başlığı en az 1 karakter olmalıdır')
    .max(200, 'Görev başlığı en fazla 200 karakter olabilir'),
  description: Yup.string()
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
  status: Yup.string()
    .oneOf(['todo', 'in-progress', 'done'], 'Geçersiz durum'),
  assigneeId: Yup.string(),
});

export const CreateTaskModal = ({ open, onOpenChange, projectId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    enabled: open,
  });

  const users = Array.isArray(usersData) ? usersData : (usersData?.data || []);

  const mutation = useMutation({
    mutationFn: (data) => tasksApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
      formik.resetForm();
      setTags([]);
      setTagInput('');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'todo',
      assigneeId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await mutation.mutateAsync({
        ...values,
        projectId,
        tags: tags.length > 0 ? tags : undefined,
        assigneeId: values.assigneeId || undefined,
      });
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          <DialogDescription>
            Projeye yeni bir görev ekleyin. Görev başlığı zorunludur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Görev Başlığı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Örn: Login sayfası tasarımı"
                className={formik.errors.title && formik.touched.title ? 'border-destructive' : ''}
              />
              {formik.errors.title && formik.touched.title && (
                <p className="text-sm text-destructive">{formik.errors.title}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Görev hakkında açıklama..."
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formik.errors.description && formik.touched.description && (
                <p className="text-sm text-destructive">{formik.errors.description}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Durum</Label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => formik.setFieldValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Yapılacak</SelectItem>
                  <SelectItem value="in-progress">Devam Ediyor</SelectItem>
                  <SelectItem value="done">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assigneeId">Atanan Kişi</Label>
              <Select
                value={formik.values.assigneeId || 'none'}
                onValueChange={(value) => formik.setFieldValue('assigneeId', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kişi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Atanmamış</SelectItem>
                  {users?.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Etiketler</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Etiket ekle ve Enter'a bas"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Ekle
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                setTags([]);
                setTagInput('');
                onOpenChange(false);
              }}
              disabled={mutation.isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

