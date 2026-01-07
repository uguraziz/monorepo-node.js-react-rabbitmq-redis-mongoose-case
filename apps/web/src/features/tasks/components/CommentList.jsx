import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import apiClient from '../../../api/client.js';

export const CommentList = ({ taskId }) => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => apiClient(`/api/comments?taskId=${taskId}`),
  });
  
  const mutation = useMutation({
    mutationFn: (content) => apiClient('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ content, taskId }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      setComment('');
    },
  });
  
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  
  const comments = data?.data || [];
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Yorum yazın..."
          className="flex-1"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && comment.trim()) {
              mutation.mutate(comment);
            }
          }}
        />
        <Button
          onClick={() => mutation.mutate(comment)}
          disabled={!comment.trim() || mutation.isPending}
        >
          Gönder
        </Button>
      </div>
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment._id} className="p-4 border rounded-lg">
            <p>{comment.content}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

