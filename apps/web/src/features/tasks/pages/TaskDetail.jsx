import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { tasksApi } from '../../../api/tasks.api.js';
import { PageHeader } from '../../../components/common/page-header.jsx';
import { CommentList } from '../components/CommentList.jsx';

export const TaskDetail = () => {
  const { id } = useParams();
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getById(id),
  });
  
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  
  if (!task) {
    return <div>Görev bulunamadı</div>;
  }
  
  return (
    <div>
      <PageHeader
        title={task.title}
        description={task.description}
      />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>
        <CommentList taskId={id} />
      </div>
    </div>
  );
};

