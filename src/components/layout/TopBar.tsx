import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';

interface TopBarProps {
  onMenuToggle?: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        <Dropdown
          trigger={
            <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar name={user?.name ?? 'U'} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          }
          items={[
            { key: 'profile', label: 'Mon profil', onClick: () => navigate('/admin/profile') },
            { key: 'site', label: 'Voir le site', onClick: () => navigate('/') },
            { key: 'logout', label: 'Déconnexion', danger: true, onClick: handleLogout },
          ]}
        />
      </div>
    </header>
  );
}
