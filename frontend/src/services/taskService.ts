import axios from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    const response = await api.get<{ data: Task[]; count: number }>('/tasks');
    return response.data.data;
  },

  // Get task by ID
  async getTaskById(id: number): Promise<Task> {
    const response = await api.get<{ data: Task }>(`/tasks/${id}`);
    return response.data.data;
  },

  // Create a new task
  async createTask(taskData: CreateTaskDto): Promise<Task> {
    const response = await api.post<{ message: string; data: Task }>('/tasks', taskData);
    return response.data.data;
  },

  // Update task
  async updateTask(id: number, taskData: UpdateTaskDto): Promise<Task> {
    const response = await api.patch<{ message: string; data: Task }>(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  // Delete task
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
