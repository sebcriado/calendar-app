import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock, Layout } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

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
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-background rounded-2xl p-8 shadow-lg">
              <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Gestion du temps simplifiée</h3>
              <p className="text-muted-foreground">
                Visualisez votre semaine en un coup d'œil et organisez vos tâches efficacement.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-8 shadow-lg">
              <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Interface intuitive</h3>
              <p className="text-muted-foreground">
                Une interface épurée et moderne pour une expérience utilisateur optimale.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-8 shadow-lg">
              <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Flexibilité totale</h3>
              <p className="text-muted-foreground">
                Ajoutez, modifiez et supprimez vos tâches en quelques clics.
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
            <p>© 2024 Calendar App. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}