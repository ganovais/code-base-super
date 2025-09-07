import api from './api';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
import { AxiosResponse } from 'axios';

interface TasksListResponse {
  message: string;
  tasks: Task[];
}

interface SingleTaskResponse {
  message: string;
  task: Task;
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response: AxiosResponse<TasksListResponse> = await api.get('/tasks');
    return response.data.tasks;
  },

  async getTask(id: string): Promise<Task> {
    const response: AxiosResponse<SingleTaskResponse> = await api.get(`/tasks/${id}`);
    return response.data.task;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response: AxiosResponse<SingleTaskResponse> = await api.post('/tasks', data);
    return response.data.task;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response: AxiosResponse<SingleTaskResponse> = await api.put(`/tasks/${id}`, data);
    return response.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
