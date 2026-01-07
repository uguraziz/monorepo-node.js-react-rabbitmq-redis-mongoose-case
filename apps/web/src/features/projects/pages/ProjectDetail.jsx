import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { projectsApi } from '../../../api/projects.api.js';
import { PageHeader } from '../../../components/common/page-header.jsx';
import { ProjectTable } from '../components/ProjectTable.jsx';
import { CreateTaskModal } from '../../tasks/components/CreateTaskModal.jsx';
import { Button } from '../../../components/ui/button.jsx';

export const ProjectDetail = () => {
  const { id } = useParams();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id),
  });
  
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  
  if (!project) {
    return <div>Proje bulunamadı</div>;
  }
  
  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description}
        action={
          <Button onClick={() => setCreateTaskOpen(true)}>
            Görev Ekle
          </Button>
        }
      />
      <ProjectTable projectId={id} />
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        projectId={id}
      />
    </div>
  );
};

