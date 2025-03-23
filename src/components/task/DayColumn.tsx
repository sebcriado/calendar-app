import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/lib/types';
import { TaskItem } from './TaskItem';

interface DayColumnProps {
  day: string;
  tasks: Task[];
  isSelectionMode: boolean;
  selectedTaskIds: Set<string>;
  onOpenAddDialog: (day: string) => void;
  onSelectTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function DayColumn({
  day,
  tasks,
  isSelectionMode,
  selectedTaskIds,
  onOpenAddDialog,
  onSelectTask,
  onDeleteTask
}: DayColumnProps) {
  const dayTasks = tasks
    .filter((task) => task.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="border rounded-lg p-4 space-y-4 min-h-[200px]">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{day}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenAddDialog(day)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {dayTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelectionMode={isSelectionMode}
            isSelected={selectedTaskIds.has(task.id)}
            onSelect={onSelectTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}