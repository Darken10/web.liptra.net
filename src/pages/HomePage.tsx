import { Link } from 'react-router-dom';
import { Search, Shield, Smartphone, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Voyagez simplement au Burkina Faso
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8">
              Réservez vos tickets de transport en ligne. Comparez les prix,
              choisissez votre compagnie et payez par Mobile Money.
            </p>
            <Link to="/trips">
              <Button size="lg" className="bg-white !text-primary-700 hover:bg-primary-50">
                <Search className="h-5 w-5 mr-2" />
                Rechercher un voyage
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir LIPTRA ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-8 w-8 text-primary-600" />}
              title="Recherche facile"
              description="Trouvez rapidement les voyages disponibles entre toutes les villes du Burkina."
            />
            <FeatureCard
              icon={<Smartphone className="h-8 w-8 text-primary-600" />}
              title="Paiement Mobile Money"
              description="Payez avec Orange Money, Moov Money, Wave ou Coris Money Plus."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary-600" />}
              title="Ticket sécurisé"
              description="QR Code et code de validation à 6 chiffres pour un embarquement rapide."
            />
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Itinéraires populaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouteCard from="Ouagadougou" to="Bobo-Dioulasso" duration="5h" />
            <RouteCard from="Ouagadougou" to="Koudougou" duration="2h" />
            <RouteCard from="Ouagadougou" to="Ouahigouya" duration="4h" />
            <RouteCard from="Bobo-Dioulasso" to="Banfora" duration="2h" />
            <RouteCard from="Ouagadougou" to="Kaya" duration="2h30" />
            <RouteCard from="Ouagadougou" to="Fada N'Gourma" duration="4h" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Prêt à voyager ?
          </h2>
          <p className="text-primary-100 mb-8">
            Créez votre compte gratuitement et réservez votre prochain voyage en
            quelques minutes.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white !text-primary-700 hover:bg-primary-50">
              Créer mon compte
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 rounded-xl bg-gray-50 border">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function RouteCard({
  from,
  to,
  duration,
}: {
  from: string;
  to: string;
  duration: string;
}) {
  return (
    <Link
      to={`/trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition"
    >
      <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {from} → {to}
        </p>
        <p className="text-sm text-gray-500">~{duration}</p>
      </div>
      <span className="text-primary-600 text-sm font-medium">Voir →</span>
    </Link>
  );
}
