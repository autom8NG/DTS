import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import taskRepository from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';

export class TaskController {
  // Create a new task
  async createTask(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskData: CreateTaskDto = req.body;
      const task = await taskRepository.create(taskData);

      return res.status(201).json({
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get task by ID
  async getTaskById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const task = await taskRepository.findById(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({
        data: task,
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all tasks
  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await taskRepository.findAll();

      return res.status(200).json({
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update task
  async updateTask(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const updateData: UpdateTaskDto = req.body;

      const updatedTask = await taskRepository.update(id, updateData);

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({
        message: 'Task updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete task
  async deleteTask(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const deleted = await taskRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({
        message: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new TaskController();
