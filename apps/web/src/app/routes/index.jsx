import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './protected.jsx';
import { AppLayout } from '../../layouts/app-layout.jsx';
import { AuthLayout } from '../../layouts/auth-layout.jsx';
import { Login } from '../../features/auth/pages/Login.jsx';
import { ProjectsList } from '../../features/projects/pages/ProjectsList.jsx';
import { ProjectDetail } from '../../features/projects/pages/ProjectDetail.jsx';
import { TaskDetail } from '../../features/tasks/pages/TaskDetail.jsx';
import { Profile } from '../../features/profile/pages/Profile.jsx';
import { UsersList } from '../../features/users/pages/UsersList.jsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/projects" replace />,
      },
      {
        path: 'projects',
        element: <ProjectsList />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetail />,
      },
      {
        path: 'tasks/:id',
        element: <TaskDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'users',
        element: <UsersList />,
      },
    ],
  },
]);

