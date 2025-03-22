import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, writeBatch, limit } from 'firebase/firestore';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  day: string;
  time: string;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function Calendar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [newTask, setNewTask] = useState({ title: '', time: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Vérifier la connexion à Firestore
  useEffect(() => {
    const checkFirestoreConnection = async () => {
      if (!user) return;
      
      try {
        // Test simple pour vérifier la connexion
        const testRef = collection(db, "tasks");
        await getDocs(query(testRef, where("test", "==", true), limit(1)));
        setError(null);
      } catch (err: any) {
        console.error("Erreur de connexion à Firestore:", err);
        setError("Problème de connexion à la base de données");
      }
    };
    
    checkFirestoreConnection();
  }, [user]);

  // Charger les tâches au chargement du composant
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const tasksCollection = collection(db, "tasks");
        const q = query(tasksCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedTasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTasks.push({
            id: doc.id,
            title: data.title,
            day: data.day,
            time: data.time
          });
        });
        
        setTasks(fetchedTasks);
        setError(null);
      } catch (error: any) {
        console.error("Erreur lors du chargement des tâches:", error);
        setError(error.message || "Erreur lors du chargement des tâches");
        
        // Fallback sur localStorage si Firestore échoue
        const savedTasks = localStorage.getItem(`calendar-tasks-${user.uid}`);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
          toast.info("Chargement des tâches depuis le stockage local");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  // Sauvegarder les tâches dans localStorage comme solution de secours
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(`calendar-tasks-${user.uid}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = async () => {
    if (newTask.title && newTask.time && selectedDay && user) {
      try {
        // Ajouter à Firestore
        const docRef = await addDoc(collection(db, "tasks"), {
          title: newTask.title,
          day: selectedDay,
          time: newTask.time,
          userId: user.uid,
          createdAt: new Date()
        });
        
        // Mettre à jour l'état local
        const newTaskObj = {
          id: docRef.id,
          title: newTask.title,
          day: selectedDay,
          time: newTask.time,
        };
        
        setTasks([...tasks, newTaskObj]);
        setNewTask({ title: '', time: '' });
        toast.success("Tâche ajoutée avec succès");
      } catch (error: any) {
        console.error("Erreur lors de l'ajout de la tâche:", error);
        toast.error("Erreur lors de l'ajout de la tâche");
        
        // En cas d'échec, ajouter à localStorage uniquement
        const localTaskId = Math.random().toString(36).substr(2, 9);
        const newTaskObj = {
          id: localTaskId,
          title: newTask.title,
          day: selectedDay,
          time: newTask.time,
        };
        
        setTasks([...tasks, newTaskObj]);
        setNewTask({ title: '', time: '' });
        localStorage.setItem(`calendar-tasks-${user.uid}`, JSON.stringify([...tasks, newTaskObj]));
        toast.info("Tâche sauvegardée localement uniquement");
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Supprimer de Firestore
      await deleteDoc(doc(db, "tasks", taskId));
      
      // Mettre à jour l'état local
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(`calendar-tasks-${user.uid}`, JSON.stringify(updatedTasks));
      toast.success("Tâche supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      toast.error("Erreur lors de la suppression de la tâche");
      
      // Supprimer localement quand même
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(`calendar-tasks-${user.uid}`, JSON.stringify(updatedTasks));
      toast.info("Tâche supprimée localement uniquement");
    }
  };

  const resetTasks = async () => {
    if (!user) return;
    
    try {
      // Supprimer toutes les tâches de l'utilisateur
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      
      await batch.commit();
      
      // Mettre à jour l'état local
      setTasks([]);
      localStorage.removeItem(`calendar-tasks-${user.uid}`);
      toast.success("Toutes les tâches ont été supprimées");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des tâches:", error);
      toast.error("Erreur lors de la réinitialisation des tâches");
      
      // Réinitialiser localement quand même
      setTasks([]);
      localStorage.removeItem(`calendar-tasks-${user.uid}`);
      toast.info("Tâches réinitialisées localement uniquement");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Chargement de vos tâches...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-6">
        <div className="w-full max-w-none space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive p-4 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error} - Les données sont sauvegardées localement</p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Calendrier hebdomadaire</h1>
            <Button variant="destructive" onClick={resetTasks}>
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {DAYS.map((day) => (
              <div key={day} className="border rounded-lg p-4 space-y-4 min-h-[200px]">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{day}</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDay(day)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter une tâche pour {day}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          placeholder="Titre de la tâche"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                        />
                        <Input
                          type="time"
                          value={newTask.time}
                          onChange={(e) =>
                            setNewTask({ ...newTask, time: e.target.value })
                          }
                        />
                        <Button onClick={addTask} className="w-full">
                          Ajouter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  {tasks
                    .filter((task) => task.day === day)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 bg-secondary rounded"
                      >
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.time}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}