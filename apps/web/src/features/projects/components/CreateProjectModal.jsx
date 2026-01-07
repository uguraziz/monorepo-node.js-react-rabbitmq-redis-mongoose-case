import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../../api/projects.api.js';
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

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Proje adı gereklidir')
    .min(3, 'Proje adı en az 3 karakter olmalıdır')
    .max(100, 'Proje adı en fazla 100 karakter olabilir'),
  description: Yup.string()
    .max(500, 'Açıklama en fazla 500 karakter olabilir'),
});

export const CreateProjectModal = ({ open, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data) => projectsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      formik.resetForm();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
  
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Proje Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir proje oluşturun. Proje adı zorunludur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Proje Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Örn: Web Sitesi Geliştirme"
                className={formik.errors.name && formik.touched.name ? 'border-destructive' : ''}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
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
                placeholder="Proje hakkında açıklama..."
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formik.errors.description && formik.touched.description && (
                <p className="text-sm text-destructive">{formik.errors.description}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
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

