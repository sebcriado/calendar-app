import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      try {
        await signInWithPopup(auth, provider);
        toast.success('Connexion réussie');
      } catch (error: any) {
        if (error.code === 'auth/popup-blocked') {
          toast.error('Les popups sont bloqués. Veuillez autoriser les popups pour ce site dans les paramètres de votre navigateur et réessayer.');
          return;
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      let message = 'Une erreur est survenue lors de la connexion';
      
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Connexion annulée';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'La requête de connexion a été annulée';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Erreur de connexion réseau. Veuillez vérifier votre connexion internet.';
      }
      
      toast.error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};