import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-3">LIPTRA</h3>
              <p className="text-sm">
                Votre plateforme de transport au Burkina Faso. Voyagez en toute
                simplicité.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Liens utiles</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/trips" className="hover:text-white transition">
                    Rechercher un voyage
                  </a>
                </li>
                <li>
                  <a
                    href="/announcements"
                    className="hover:text-white transition"
                  >
                    Actualités
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Ouagadougou, Burkina Faso</li>
                <li>+226 70 00 00 00</li>
                <li>contact@liptra.net</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} LIPTRA. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
