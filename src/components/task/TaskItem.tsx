import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, isSelectionMode, isSelected, onSelect, onDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded",
        isSelectionMode ? "cursor-pointer" : "",
        isSelected ? "bg-primary/20 border border-primary" : "bg-secondary"
      )}
      onClick={() => isSelectionMode && onSelect(task.id)}
    >
      <div className="flex items-center gap-2">
        {isSelectionMode && (
          <div className="flex-shrink-0">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onSelect(task.id)}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-none"
            />
          </div>
        )}
        <div>
          <p className="font-medium">{task.title}</p>
          <p className="text-sm text-muted-foreground">
            {task.time}
          </p>
        </div>
      </div>
      {!isSelectionMode && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}