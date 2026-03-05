import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Ticket, Search, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary-600'
        : 'text-gray-600 hover:text-primary-600'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-[var(--shadow-soft)] border-b border-gray-100'
          : 'bg-white/95 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm group-hover:shadow-[var(--shadow-glow-primary)] transition-shadow duration-300">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-primary-700">LIP</span>
              <span className="text-primary-500">TRA</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <NavLink to="/trips" className={linkClass}>
              <Search className="inline h-4 w-4 mr-1 -mt-0.5" />
              Voyages
            </NavLink>
            <NavLink to="/announcements" className={linkClass}>
              Actualités
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/bookings" className={linkClass}>
                Mes réservations
              </NavLink>
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-danger-500 p-2 rounded-lg hover:bg-danger-50 transition-all duration-200"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 active:scale-[0.98]"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 glass animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            <MobileLink to="/trips" onClick={() => setOpen(false)} label="Voyages" />
            <MobileLink to="/announcements" onClick={() => setOpen(false)} label="Actualités" />
            {isAuthenticated ? (
              <>
                <MobileLink to="/bookings" onClick={() => setOpen(false)} label="Mes réservations" />
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-danger-600 hover:bg-danger-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block text-center gradient-primary text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileLink({ to, onClick, label }: { to: string; onClick: () => void; label: string }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      {label}
      <ChevronRight className="h-4 w-4 opacity-40" />
    </NavLink>
  );
}
