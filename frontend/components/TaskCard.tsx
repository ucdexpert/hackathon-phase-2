import React from 'react';
import { Square, CheckSquare } from 'lucide-react';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggle }) => {
  return (
    <div className={`bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => onToggle(task.id)}
            className="mr-3 mt-1"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? (
              <CheckSquare className="text-green-500" size={20} />
            ) : (
              <Square className="text-gray-400" size={20} />
            )}
          </button>
          <div>
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(task.id)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Created: {new Date(task.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;