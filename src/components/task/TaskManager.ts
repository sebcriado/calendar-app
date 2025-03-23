import { useState } from 'react';
import { writeBatch, doc, collection, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Task } from '@/lib/types';

interface TaskManagerProps {
  userId: string | undefined;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function useTaskManager({ userId, tasks, setTasks }: TaskManagerProps) {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [newTask, setNewTask] = useState({ title: '', time: '' });
  const [isRepeated, setIsRepeated] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const addTask = async () => {
    if (newTask.title && newTask.time && userId) {
      try {
        let daysToAdd: string[] = [];
        
        if (isRepeated) {
          daysToAdd = Object.entries(selectedDays)
            .filter(([, isSelected]) => isSelected)
            .map(([day]) => day);
            
          if (daysToAdd.length === 0) {
            toast.error("Veuillez sélectionner au moins un jour");
            return;
          }
        } else {
          if (!selectedDay) {
            toast.error("Veuillez sélectionner un jour");
            return;
          }
          daysToAdd = [selectedDay];
        }
        
        const batch = writeBatch(db);
        const newTasks: Task[] = [];
        
        for (const day of daysToAdd) {
          const newTaskRef = doc(collection(db, "tasks"));
          batch.set(newTaskRef, {
            title: newTask.title,
            day: day,
            time: newTask.time,
            userId: userId,
            createdAt: new Date()
          });
          
          newTasks.push({
            id: newTaskRef.id,
            title: newTask.title,
            day: day,
            time: newTask.time,
          });
        }
        
        await batch.commit();
        
        setTasks([...tasks, ...newTasks]);
        setNewTask({ title: '', time: '' });
        setIsRepeated(false);
        setSelectedDays({});
        toast.success(`Tâche ajoutée pour ${daysToAdd.length} jour(s)`);
      } catch (error: any) {
        console.error("Erreur lors de l'ajout des tâches:", error);
        toast.error("Erreur lors de l'ajout des tâches");
      }
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(`calendar-tasks-${userId}`, JSON.stringify(updatedTasks));
      toast.success("Tâche supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      toast.error("Erreur lors de la suppression de la tâche");
      
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(`calendar-tasks-${userId}`, JSON.stringify(updatedTasks));
      toast.info("Tâche supprimée localement uniquement");
    }
  };

  const resetTasks = async () => {
    if (!userId) return;
    
    try {
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      
      await batch.commit();
      
      setTasks([]);
      localStorage.removeItem(`calendar-tasks-${userId}`);
      toast.success("Toutes les tâches ont été supprimées");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des tâches:", error);
      toast.error("Erreur lors de la réinitialisation des tâches");
      
      setTasks([]);
      localStorage.removeItem(`calendar-tasks-${userId}`);
      toast.info("Tâches réinitialisées localement uniquement");
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelection = new Set(selectedTaskIds);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTaskIds(newSelection);
  };

  const deleteSelectedTasks = async () => {
    if (selectedTaskIds.size === 0 || !userId) return;
    
    try {
      const batch = writeBatch(db);
      
      selectedTaskIds.forEach(taskId => {
        batch.delete(doc(db, "tasks", taskId));
      });
      
      await batch.commit();
      
      const updatedTasks = tasks.filter((task) => !selectedTaskIds.has(task.id));
      setTasks(updatedTasks);
      localStorage.setItem(`calendar-tasks-${userId}`, JSON.stringify(updatedTasks));
      
      toast.success(`${selectedTaskIds.size} tâche(s) supprimée(s)`);
      setSelectedTaskIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Erreur lors de la suppression des tâches:", error);
      toast.error("Erreur lors de la suppression des tâches");
      
      const updatedTasks = tasks.filter((task) => !selectedTaskIds.has(task.id));
      setTasks(updatedTasks);
      localStorage.setItem(`calendar-tasks-${userId}`, JSON.stringify(updatedTasks));
      toast.info("Tâches supprimées localement uniquement");
      setSelectedTaskIds(new Set());
      setIsSelectionMode(false);
    }
  };

  return {
    selectedDay,
    setSelectedDay,
    newTask,
    setNewTask,
    isRepeated,
    setIsRepeated,
    selectedDays,
    setSelectedDays,
    selectedTaskIds,
    setSelectedTaskIds,
    isSelectionMode,
    setIsSelectionMode,
    addTask,
    deleteTask,
    resetTasks,
    toggleTaskSelection,
    deleteSelectedTasks
  };
}