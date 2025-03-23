import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DAYS } from '@/lib/types';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isRepeated: boolean;
  setIsRepeated: (isRepeated: boolean) => void;
  newTask: { title: string; time: string };
  setNewTask: (newTask: { title: string; time: string }) => void;
  selectedDays: Record<string, boolean>;
  setSelectedDays: (selectedDays: Record<string, boolean>) => void;
  onAdd: () => Promise<void>;
}

export function AddTaskDialog({
  open,
  onOpenChange,
  title,
  isRepeated,
  setIsRepeated,
  newTask,
  setNewTask,
  selectedDays,
  setSelectedDays,
  onAdd
}: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Titre de la tâche"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          
          <Input
            type="time"
            value={newTask.time}
            onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
          />
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="repeat-mode" 
              checked={isRepeated}
              onCheckedChange={setIsRepeated}
            />
            <Label htmlFor="repeat-mode">Tâche répétée</Label>
          </div>
          
          {isRepeated && (
            <div className="space-y-2 border p-3 rounded-md">
              <p className="text-sm font-medium mb-2">Sélectionnez les jours:</p>
              <div className="grid grid-cols-2 gap-2">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`day-${day}`}
                      checked={selectedDays[day] || false}
                      onCheckedChange={(checked) => {
                        setSelectedDays({
                          ...selectedDays,
                          [day]: !!checked
                        });
                      }}
                    />
                    <Label htmlFor={`day-${day}`}>{day}</Label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDays(Object.fromEntries(DAYS.map(day => [day, true])))}
                >
                  Tout sélectionner
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDays({})}
                >
                  Tout désélectionner
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            onClick={onAdd} 
            className={cn("w-full", 
              (!newTask.title || !newTask.time) && "opacity-50 cursor-not-allowed"
            )}
            disabled={!newTask.title || !newTask.time}
          >
            Ajouter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}