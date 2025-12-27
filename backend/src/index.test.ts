import request from 'supertest';
import app from './index.js';
import taskRepository from './repositories/task.repository.js';
import { TaskStatus } from './types/task.types.js';

describe('Task API', () => {
  beforeEach(async () => {
    // Clear database before each test
    await taskRepository.deleteAll();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with all fields', async () => {
      const taskData = {
        title: 'Complete project',
        description: 'Finish the DTS challenge',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        dueDateTime: taskData.dueDateTime,
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should create a task without optional fields', async () => {
      const taskData = {
        title: 'Simple task',
        dueDateTime: '2025-12-31T23:59:59Z',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBeNull();
      expect(response.body.data.status).toBe(TaskStatus.TODO);
    });

    it('should return 400 if title is missing', async () => {
      const taskData = {
        dueDateTime: '2025-12-31T23:59:59Z',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain('Title is required');
    });

    it('should return 400 if dueDateTime is missing', async () => {
      const taskData = {
        title: 'Test task',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 if dueDateTime is invalid', async () => {
      const taskData = {
        title: 'Test task',
        dueDateTime: 'invalid-date',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 if status is invalid', async () => {
      const taskData = {
        title: 'Test task',
        status: 'INVALID_STATUS',
        dueDateTime: '2025-12-31T23:59:59Z',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return all tasks', async () => {
      // Create multiple tasks
      await taskRepository.create({
        title: 'Task 1',
        dueDateTime: '2025-12-30T10:00:00Z',
      });
      await taskRepository.create({
        title: 'Task 2',
        dueDateTime: '2025-12-31T10:00:00Z',
      });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Task 1');
      expect(response.body.data[1].title).toBe('Task 2');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      const task = await taskRepository.create({
        title: 'Test task',
        description: 'Test description',
        dueDateTime: '2025-12-31T23:59:59Z',
      });

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body.data).toMatchObject({
        id: task.id,
        title: task.title,
        description: task.description,
      });
    });

    it('should return 404 if task does not exist', async () => {
      const response = await request(app)
        .get('/api/tasks/9999')
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid')
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update task status', async () => {
      const task = await taskRepository.create({
        title: 'Test task',
        dueDateTime: '2025-12-31T23:59:59Z',
      });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ status: TaskStatus.IN_PROGRESS })
        .expect(200);

      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should update multiple fields', async () => {
      const task = await taskRepository.create({
        title: 'Old title',
        dueDateTime: '2025-12-31T23:59:59Z',
      });

      const updates = {
        title: 'New title',
        description: 'New description',
        status: TaskStatus.COMPLETED,
      };

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send(updates)
        .expect(200);

      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.description).toBe(updates.description);
      expect(response.body.data.status).toBe(updates.status);
    });

    it('should return 404 if task does not exist', async () => {
      const response = await request(app)
        .patch('/api/tasks/9999')
        .send({ status: TaskStatus.COMPLETED })
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid status', async () => {
      const task = await taskRepository.create({
        title: 'Test task',
        dueDateTime: '2025-12-31T23:59:59Z',
      });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ status: 'INVALID' })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await taskRepository.create({
        title: 'Task to delete',
        dueDateTime: '2025-12-31T23:59:59Z',
      });

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(404);
    });

    it('should return 404 if task does not exist', async () => {
      const response = await request(app)
        .delete('/api/tasks/9999')
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid')
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Health Check', () => {
    it('should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body.error).toBe('Route not found');
    });
  });
});
