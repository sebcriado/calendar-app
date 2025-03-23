import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth';
import { DAYS } from '@/lib/types';
import { useTaskManager } from '@/components/task/TaskManager';
import { DayColumn } from '@/components/task/DayColumn';
import { AddTaskDialog } from '@/components/task/AddTaskDialog';
import { useTasks } from '@/hooks/use-tasks';

export default function Calendar() {
  const { user } = useAuth();
  const { tasks, setTasks, loading, error } = useTasks(user?.uid);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
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
  } = useTaskManager({
    userId: user?.uid,
    tasks,
    setTasks
  });

  const handleOpenAddDialog = (day: string) => {
    setSelectedDay(day);
    setIsRepeated(false);
    setSelectedDays({});
    setIsAddDialogOpen(true);
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
            <div className="flex gap-2">
              {isSelectionMode ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedTaskIds(new Set());
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={deleteSelectedTasks}
                    disabled={selectedTaskIds.size === 0}
                  >
                    Supprimer {selectedTaskIds.size > 0 ? `(${selectedTaskIds.size})` : ""}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSelectionMode(true)}
                    disabled={tasks.length === 0}
                  >
                    Sélectionner
                  </Button>
                  <Button variant="destructive" onClick={resetTasks}>
                    Réinitialiser
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {DAYS.map((day) => (
              <DayColumn
                key={day}
                day={day}
                tasks={tasks}
                isSelectionMode={isSelectionMode}
                selectedTaskIds={selectedTaskIds}
                onOpenAddDialog={handleOpenAddDialog}
                onSelectTask={toggleTaskSelection}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>
        </div>
      </main>

      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title={isRepeated ? "Ajouter une tâche répétée" : `Ajouter une tâche pour ${selectedDay}`}
        isRepeated={isRepeated}
        setIsRepeated={setIsRepeated}
        newTask={newTask}
        setNewTask={setNewTask}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        onAdd={async () => {
          await addTask();
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
}