import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Smartphone,
  MapPin,
  ArrowRight,
  Zap,
  Clock,
  Star,
  Users,
  CheckCircle,
  ArrowRightLeft,
} from 'lucide-react';
import { cityApi } from '@/lib/api';
import type { City } from '@/types';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [departureCityId, setDepartureCityId] = useState('');
  const [arrivalCityId, setArrivalCityId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    cityApi.list().then((res) => setCities(res.data.data));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (departureCityId) params.set('departure_city_id', departureCityId);
    if (arrivalCityId) params.set('arrival_city_id', arrivalCityId);
    if (date) params.set('date', date);
    navigate(`/trips?${params.toString()}`);
  };

  const swapCities = () => {
    setDepartureCityId(arrivalCityId);
    setArrivalCityId(departureCityId);
  };

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden gradient-hero text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-32 sm:pb-40">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
              <Zap className="h-4 w-4 text-accent-400" />
              <span>La billetterie n°1 au Burkina Faso</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Voyagez simplement,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                payez facilement
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Réservez vos tickets de transport en ligne. Comparez les compagnies,
              choisissez votre siège et payez par Mobile Money.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl shadow-[var(--shadow-elevated)] p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Départ
                  </label>
                  <select
                    value={departureCityId}
                    onChange={(e) => setDepartureCityId(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="">Ville de départ</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swapCities}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all self-end mb-1 cursor-pointer"
                  title="Inverser"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Arrivée
                  </label>
                  <select
                    value={arrivalCityId}
                    onChange={(e) => setArrivalCityId(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="">Ville d'arrivée</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>

                <Button onClick={handleSearch} size="lg" className="sm:!px-8 !py-3">
                  <Search className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Stats ─── */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBubble icon={<Users className="h-5 w-5" />} value="10 000+" label="Voyageurs" />
            <StatBubble icon={<MapPin className="h-5 w-5" />} value="50+" label="Destinations" />
            <StatBubble icon={<Star className="h-5 w-5" />} value="4.8/5" label="Satisfaction" />
            <StatBubble icon={<CheckCircle className="h-5 w-5" />} value="99.9%" label="Fiabilité" />
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
              Pourquoi nous choisir
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Une expérience de voyage{' '}
              <span className="gradient-text">simplifiée</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Recherche intelligente"
              description="Comparez les prix et horaires de toutes les compagnies en un instant. Trouvez le voyage parfait."
              color="primary"
            />
            <FeatureCard
              icon={<Smartphone className="h-6 w-6" />}
              title="Paiement Mobile Money"
              description="Orange Money, Moov Money, Wave, Coris Money Plus — payez avec votre moyen préféré."
              color="accent"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Ticket 100% sécurisé"
              description="QR Code unique et code de validation à 6 chiffres pour un embarquement rapide et sécurisé."
              color="success"
            />
          </div>
        </div>
      </section>

      {/* ─── Popular Routes ─── */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
                Les plus populaires
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Itinéraires populaires
              </h2>
            </div>
            <Link
              to="/trips"
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1 group"
            >
              Voir tous les voyages
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <RouteCard from="Ouagadougou" to="Bobo-Dioulasso" duration="5h" price="5 000" />
            <RouteCard from="Ouagadougou" to="Koudougou" duration="2h" price="2 500" />
            <RouteCard from="Ouagadougou" to="Ouahigouya" duration="4h" price="4 000" />
            <RouteCard from="Bobo-Dioulasso" to="Banfora" duration="2h" price="2 500" />
            <RouteCard from="Ouagadougou" to="Kaya" duration="2h30" price="3 000" />
            <RouteCard from="Ouagadougou" to="Fada N'Gourma" duration="4h" price="4 500" />
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
              Simple et rapide
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Comment ça marche ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200" />
            <StepCard step={1} title="Recherchez" description="Entrez votre trajet et la date souhaitée" />
            <StepCard step={2} title="Réservez" description="Choisissez votre voyage et remplissez vos infos" />
            <StepCard step={3} title="Voyagez" description="Recevez votre e-ticket et présentez-le à la gare" />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero py-20 sm:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Prêt à voyager ?
            </h2>
            <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
              Créez votre compte gratuitement et réservez votre prochain voyage
              en quelques minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white !text-primary-700 hover:bg-gray-50 w-full sm:w-auto">
                  Créer mon compte
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/trips">
                <Button size="lg" variant="outline" className="!border-white/30 !text-white hover:!bg-white/10 w-full sm:w-auto">
                  Explorer les voyages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatBubble({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-5 text-center hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
      <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-50 text-primary-600 rounded-xl mb-3">
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'accent' | 'success';
}) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
    accent: 'bg-accent-50 text-accent-600 group-hover:bg-accent-100',
    success: 'bg-success-50 text-success-600 group-hover:bg-success-100',
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-colors ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function RouteCard({
  from,
  to,
  duration,
  price,
}: {
  from: string;
  to: string;
  duration: string;
  price: string;
}) {
  return (
    <Link
      to={`/trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
      className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
        <MapPin className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">
          {from} → {to}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            ~{duration}
          </span>
          <span className="text-xs font-semibold text-primary-600">
            dès {price} FCFA
          </span>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="relative text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary text-white text-xl font-extrabold mb-5 shadow-lg shadow-primary-500/25 relative z-10">
        {step}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
