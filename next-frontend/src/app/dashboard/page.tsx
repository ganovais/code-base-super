'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { taskService } from '@/lib/tasks';
import { useAuthStore } from '@/store/auth';
import { Task, TaskStatus, CreateTaskData } from '@/types/task';
import { getErrorMessage } from '@/types/error';
import { CheckCircle, Circle, Plus, Trash2, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadTasks();
  }, [isAuthenticated, router]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsCreating(true);
      const taskData: CreateTaskData = {
        title: newTaskTitle,
        ...(newTaskDescription.trim() && { description: newTaskDescription.trim() })
      };
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: TaskStatus) => {
    try {
      const newStatus = currentStatus === TaskStatus.PENDING 
        ? TaskStatus.COMPLETED 
        : TaskStatus.PENDING;
      
      const updatedTask = await taskService.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error: unknown) {
      setError(getErrorMessage(error) || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Task Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Enter task description"
                  value={newTaskDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Task'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError('')}
              className="mt-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Tasks</h2>
          
          {isLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">No tasks yet. Create your first task above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className={task.status === TaskStatus.COMPLETED ? 'opacity-75' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          onClick={() => handleToggleComplete(task.id, task.status)}
                          className="text-primary hover:text-primary/80"
                        >
                          {task.status === TaskStatus.COMPLETED ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className={`font-medium ${task.status === TaskStatus.COMPLETED ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm text-gray-600 mt-1 ${task.status === TaskStatus.COMPLETED ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
