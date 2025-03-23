import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Task } from '@/lib/types';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier la connexion à Firestore
  useEffect(() => {
    const checkFirestoreConnection = async () => {
      if (!userId) return;
      
      try {
        const testRef = collection(db, "tasks");
        await getDocs(query(testRef, where("test", "==", true), limit(1)));
        setError(null);
      } catch (err: any) {
        console.error("Erreur de connexion à Firestore:", err);
        setError("Problème de connexion à la base de données");
      }
    };
    
    checkFirestoreConnection();
  }, [userId]);

  // Charger les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const tasksCollection = collection(db, "tasks");
        const q = query(tasksCollection, where("userId", "==", userId));
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
        
        // Fallback sur localStorage
        const savedTasks = localStorage.getItem(`calendar-tasks-${userId}`);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
          toast.info("Chargement des tâches depuis le stockage local");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // Sauvegarde locale
  useEffect(() => {
    if (userId && tasks.length > 0) {
      localStorage.setItem(`calendar-tasks-${userId}`, JSON.stringify(tasks));
    }
  }, [tasks, userId]);

  return {
    tasks,
    setTasks,
    loading,
    error
  };
}