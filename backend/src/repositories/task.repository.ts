import db from '../database/db';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types/task.types';

export class TaskRepository {
  // Create a new task
  create(taskData: CreateTaskDto): Task {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, status, dueDateTime, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const status = taskData.status || TaskStatus.TODO;
    const info = stmt.run(
      taskData.title,
      taskData.description || null,
      status,
      taskData.dueDateTime
    );

    return this.findById(info.lastInsertRowid as number)!;
  }

  // Find task by ID
  findById(id: number): Task | undefined {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id) as Task | undefined;
  }

  // Find all tasks
  findAll(): Task[] {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY dueDateTime ASC');
    return stmt.all() as Task[];
  }

  // Update task
  update(id: number, taskData: UpdateTaskDto): Task | undefined {
    const existingTask = this.findById(id);
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

    const stmt = db.prepare(`
      UPDATE tasks SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  // Delete task
  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  // Clear all tasks (for testing)
  deleteAll(): void {
    db.prepare('DELETE FROM tasks').run();
  }
}

export default new TaskRepository();
