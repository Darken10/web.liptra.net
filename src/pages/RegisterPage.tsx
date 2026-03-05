import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Shield, Zap, MapPin, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/bookings');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erreur lors de l'inscription";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex">
      {/* Left: Branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Ticket className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">LIPTRA</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight mb-4">
            Rejoignez des milliers de voyageurs
          </h2>
          <p className="text-primary-200 text-lg max-w-md">
            Inscrivez-vous gratuitement et commencez à réserver vos voyages en toute simplicité.
          </p>
        </div>
        <div className="relative space-y-4">
          <FeatureItem icon={<Zap className="h-5 w-5" />} text="Inscription en 30 secondes" />
          <FeatureItem icon={<MapPin className="h-5 w-5" />} text="50+ destinations au Burkina" />
          <FeatureItem icon={<Shield className="h-5 w-5" />} text="Données personnelles protégées" />
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-primary-700">LIPTRA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-gray-500">
              C'est gratuit et ça prend 30 secondes
            </p>
          </div>

          {error && (
            <div className="bg-danger-50 text-danger-700 text-sm rounded-xl p-4 mb-6 border border-danger-100 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              label="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amadou Ouédraogo"
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
            <Input
              id="password"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              required
            />
            <Input
              id="password_confirmation"
              label="Confirmer le mot de passe"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Créer mon compte
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-primary-100">
      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
