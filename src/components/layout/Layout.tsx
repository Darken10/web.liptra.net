import { Link, Outlet } from 'react-router-dom';
import { Ticket, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-auto">
        {/* Top accent bar */}
        <div className="h-1 gradient-primary" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">LIPTRA</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                La plateforme n°1 de réservation de transport au Burkina Faso.
                Voyagez en toute simplicité et sécurité.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 bg-success-900/30 text-success-400 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-success-400 rounded-full animate-pulse-soft" />
                  Service actif
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Navigation
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/trips" className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    Rechercher un voyage
                  </Link>
                </li>
                <li>
                  <Link to="/announcements" className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    Actualités
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    Créer un compte
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors">Réservation en ligne</li>
                <li className="hover:text-white transition-colors">Paiement Mobile Money</li>
                <li className="hover:text-white transition-colors">E-Tickets sécurisés</li>
                <li className="hover:text-white transition-colors">Suivi des réservations</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Contact
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                  <span>Ouagadougou, Burkina Faso</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                  <span>+226 70 00 00 00</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                  <span>contact@liptra.net</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>&copy; {new Date().getFullYear()} LIPTRA. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">Conditions d'utilisation</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-white transition-colors cursor-pointer">Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
