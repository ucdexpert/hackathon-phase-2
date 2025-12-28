'use client';

import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';
import { authFunctions } from '@/lib/auth';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskListProps {
  userId: string;
}

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await taskApi.getTasks(userId, filter);
        setTasks(tasksData);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter, userId]);

  // Handle operations
  const handleAddTask = async (data: { title: string; description: string }) => {
    try {
      const newTask = await taskApi.createTask(userId, data);
      setTasks([newTask, ...tasks]);
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const handleEditTask = async (data: { title: string; description: string }) => {
    if (!editingTask) return;

    try {
      const updatedTask = await taskApi.updateTask(userId, editingTask.id, data);
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    try {
      const deletedTask = await taskApi.deleteTask(userId, deletingTask.id);
      setTasks(tasks.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const updatedTask = await taskApi.toggleComplete(userId, taskId);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err: any) {
      setError(err.message || 'Failed to update task completion status');
      console.error('Error toggling task completion:', err);
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span>+</span>
          <span className="ml-2">Add Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${
            filter === 'pending' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({tasks.filter(t => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${
            filter === 'completed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white p-4 rounded-lg border shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'all' 
              ? 'No tasks yet' 
              : filter === 'pending' 
                ? 'No pending tasks' 
                : 'No completed tasks'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Create your first task to get started' 
              : `You have no ${filter} tasks`}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Your First Task
          </button>
        </div>
      )}

      {/* Task Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(id) => {
                const taskToEdit = tasks.find(t => t.id === id);
                if (taskToEdit) setEditingTask(taskToEdit);
              }}
              onDelete={(id) => {
                const taskToDelete = tasks.find(t => t.id === id);
                if (taskToDelete) setDeletingTask(taskToDelete);
              }}
              onToggle={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h3>
            <TaskForm 
              onSubmit={handleAddTask} 
              onCancel={() => setShowAddModal(false)} 
            />
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h3>
            <TaskForm 
              task={editingTask} 
              onSubmit={handleEditTask} 
              onCancel={() => setEditingTask(null)} 
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title || ''}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
};

export default TaskList;