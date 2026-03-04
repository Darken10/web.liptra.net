import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Bus className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-700">LIPTRA</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link
                to="/trips"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Voyages
              </Link>
              <Link
                to="/announcements"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Actualités
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/bookings"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Mes réservations
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 p-2"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 px-4 py-2 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="p-2 text-gray-600">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/trips"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-primary-600 py-2 text-sm"
            >
              Voyages
            </Link>
            <Link
              to="/announcements"
              onClick={() => setOpen(false)}
              className="block text-gray-600 hover:text-primary-600 py-2 text-sm"
            >
              Actualités
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/bookings"
                  onClick={() => setOpen(false)}
                  className="block text-gray-600 hover:text-primary-600 py-2 text-sm"
                >
                  Mes réservations
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left text-red-600 py-2 text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-gray-600 py-2 text-sm"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block bg-primary-600 text-white text-center py-2 rounded-lg text-sm"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
