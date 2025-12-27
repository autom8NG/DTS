import { dbAdapter, dbPromise } from '../database/db';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types/task.types';

export class TaskRepository {
  // Create a new task
  async create(taskData: CreateTaskDto): Promise<Task> {
    await dbPromise; // Ensure DB is initialized
    
    const status = taskData.status || TaskStatus.TODO;
    
    const result = await dbAdapter.query(
      `INSERT INTO tasks (title, description, status, dueDateTime, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [taskData.title, taskData.description || null, status, taskData.dueDateTime]
    );

    const id = result.lastInsertId!;
    return (await this.findById(id))!;
  }

  // Find task by ID
  async findById(id: number): Promise<Task | undefined> {
    await dbPromise; // Ensure DB is initialized
    
    const result = await dbAdapter.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return result.rows[0] as Task | undefined;
  }

  // Find all tasks
  async findAll(): Promise<Task[]> {
    await dbPromise; // Ensure DB is initialized
    
    const result = await dbAdapter.query('SELECT * FROM tasks ORDER BY dueDateTime ASC');
    return result.rows as Task[];
  }

  // Update task
  async update(id: number, taskData: UpdateTaskDto): Promise<Task | undefined> {
    await dbPromise; // Ensure DB is initialized
    
    const existingTask = await this.findById(id);
    if (!existingTask) {
      return undefined;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (taskData.title !== undefined) {
      updates.push('title = ?');
      values.push(taskData.title);
    }
    if (taskData.description !== undefined) {
      updates.push('description = ?');
      values.push(taskData.description);
    }
    if (taskData.status !== undefined) {
      updates.push('status = ?');
      values.push(taskData.status);
    }
    if (taskData.dueDateTime !== undefined) {
      updates.push('dueDateTime = ?');
      values.push(taskData.dueDateTime);
    }

    if (updates.length === 0) {
      return existingTask;
    }

    updates.push("updatedAt = datetime('now')");
    values.push(id);

    await dbAdapter.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.findById(id);
  }

  // Delete task
  async delete(id: number): Promise<boolean> {
    await dbPromise; // Ensure DB is initialized
    
    const existingTask = await this.findById(id);
    if (!existingTask) {
      return false;
    }

    await dbAdapter.query('DELETE FROM tasks WHERE id = ?', [id]);
    return true;
  }

  // Clear all tasks (for testing)
  async deleteAll(): Promise<void> {
    await dbPromise; // Ensure DB is initialized
    await dbAdapter.query('DELETE FROM tasks');
  }
}

export default new TaskRepository();
