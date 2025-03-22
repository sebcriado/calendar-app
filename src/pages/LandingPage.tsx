import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInWithGoogle, user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation avec ThemeToggle */}
      <div className="absolute top-0 right-0 p-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="rounded-full bg-primary/10 p-4">
                  <CalendarDays className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Simplifiez votre semaine
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Organisez vos tâches hebdomadaires en toute simplicité avec notre calendrier intuitif.
                Une solution élégante pour une meilleure gestion du temps.
              </p>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={signInWithGoogle}
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                  Se connecter avec Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Section des désavantages */}
            <div className="bg-red-950 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Désavantages des applications de calendrier complexes</h2>
              <ul className="space-y-3">
                <li><span className="text-red-500 font-bold">1 hr</span> pour personnaliser l'interface</li>
                <li><span className="text-red-500 font-bold">2 hrs</span> pour paramétrer les intégrations</li>
                <li><span className="text-red-500 font-bold">2 hrs</span> pour explorer des fonctionnalités inutiles</li>
                <li><span className="text-red-500 font-bold">∞ hrs</span> de frustration...</li>
              </ul>
              <p className="mt-4 font-bold text-red-400">
                = Des heures de migraines <span className="text-xl">😣</span>
              </p>
            </div>

            {/* Section des avantages */}
            <div className="bg-green-900 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Avantages de Calendar App</h2>
              <ul className="space-y-3">
                <li><span className="text-green-400 font-bold">0 min</span> de configuration complexe</li>
                <li><span className="text-green-400 font-bold">5 min</span> pour créer votre premier événement</li>
                <li><span className="text-green-400 font-bold">2 min</span> pour maîtriser l'interface</li>
                <li><span className="text-green-400 font-bold">3 min</span> pour visualiser votre semaine</li>
                <li><span className="text-green-400 font-bold">1 min</span> pour modifier un événement</li>
                <li><span className="text-green-400 font-bold">∞ hrs</span> de productivité gagnée...</li>
              </ul>
              <p className="mt-4 font-bold text-green-400">
                = Des heures de simplicité <span className="text-xl">😌</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 rounded-3xl p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Prêt à mieux organiser votre temps ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines d'utilisateurs qui ont déjà simplifié leur gestion du temps
              avec notre calendrier hebdomadaire.
            </p>
            <Button
              size="lg"
              onClick={signInWithGoogle}
              className="text-lg px-8 bg-primary hover:bg-primary/90"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Calendar App. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}