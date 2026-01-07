import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth.store.js';
import { authApi } from '../../../api/auth.api.js';
import { PageHeader } from '../../../components/common/page-header.jsx';
import { SessionsTable } from '../components/SessionsTable.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { useAuth } from '../../../hooks/use-auth.js';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div>
      <PageHeader
        title="Profil"
        description="Hesap bilgileriniz ve oturumlarınız"
      />
      <div className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hesap Bilgileri</h2>
          <div className="space-y-2">
            <p><strong>E-posta:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.role}</p>
          </div>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Oturumlar</h2>
          <SessionsTable />
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
};

