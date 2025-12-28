import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading = false }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    if (title.length < 1 || title.length > 200) {
      setTitleError('Title must be between 1 and 200 characters');
      return;
    }

    setTitleError('');
    
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  };

  // Reset form when task prop changes
  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setTitleError('');
  }, [task]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            titleError ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
          maxLength={200}
        />
        {titleError && <p className="mt-1 text-sm text-red-600">{titleError}</p>}
        <div className="text-xs text-gray-500 mt-1">
          {title.length}/200 characters
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description (optional)"
          rows={3}
          maxLength={5000}
        />
        <div className="text-xs text-gray-500 mt-1">
          {description.length}/5000 characters
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Add Task')}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;