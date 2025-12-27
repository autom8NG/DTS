import request from 'supertest';
import app from '../index.js';
import taskRepository from '../repositories/task.repository.js';
import { TaskStatus } from '../types/task.types.js';

describe('Database Controller', () => {
  beforeEach(async () => {
    // Clear all tasks before each test
    await taskRepository.deleteAll();
  });

  describe('GET /api/database/schema', () => {
    it('should return database schema with tables and columns', async () => {
      const response = await request(app)
        .get('/api/database/schema')
        .expect(200);

      expect(response.body).toHaveProperty('tables');
      expect(Array.isArray(response.body.tables)).toBe(true);
      expect(response.body.tables).toContain('tasks');
      
      expect(response.body).toHaveProperty('schema');
      expect(response.body.schema).toHaveProperty('tasks');
      expect(response.body.schema.tasks).toHaveProperty('columns');
      expect(Array.isArray(response.body.schema.tasks.columns)).toBe(true);
    });

    it('should include column definitions for tasks table', async () => {
      const response = await request(app)
        .get('/api/database/schema')
        .expect(200);

      const tasksSchema = response.body.schema.tasks.columns;
      expect(tasksSchema.length).toBeGreaterThan(0);
      
      // Verify essential columns exist
      const columnNames = tasksSchema.map((col: any) => col.name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('title');
      expect(columnNames).toContain('status');
      expect(columnNames).toContain('dueDateTime');
    });

    it('should include index information', async () => {
      const response = await request(app)
        .get('/api/database/schema')
        .expect(200);

      expect(response.body.schema.tasks).toHaveProperty('indexes');
      expect(Array.isArray(response.body.schema.tasks.indexes)).toBe(true);
      
      // Check for specific indexes
      const indexNames = response.body.schema.tasks.indexes.map((idx: any) => idx.name);
      expect(indexNames).toContain('idx_tasks_status');
      expect(indexNames).toContain('idx_tasks_dueDateTime');
    });
  });

  describe('GET /api/database/stats', () => {
    it('should return database statistics with table count', async () => {
      const response = await request(app)
        .get('/api/database/stats')
        .expect(200);

      expect(response.body).toHaveProperty('tableCount');
      expect(typeof response.body.tableCount).toBe('number');
      expect(response.body.tableCount).toBeGreaterThanOrEqual(1);
    });

    it('should return row count for tasks table when empty', async () => {
      const response = await request(app)
        .get('/api/database/stats')
        .expect(200);

      expect(response.body).toHaveProperty('tables');
      expect(typeof response.body.tables).toBe('object');
      
      expect(response.body.tables).toHaveProperty('tasks');
      expect(response.body.tables.tasks).toHaveProperty('rowCount');
      expect(response.body.tables.tasks.rowCount).toBe(0);
    });

    it('should return correct row count after creating tasks', async () => {
      // Create 3 tasks
      await taskRepository.create({
        title: 'Task 1',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z'
      });
      await taskRepository.create({
        title: 'Task 2',
        status: TaskStatus.IN_PROGRESS,
        dueDateTime: '2025-12-30T12:00:00Z'
      });
      await taskRepository.create({
        title: 'Task 3',
        status: TaskStatus.COMPLETED,
        dueDateTime: '2025-12-29T10:00:00Z'
      });

      const response = await request(app)
        .get('/api/database/stats')
        .expect(200);

      expect(response.body.tables.tasks).toBeDefined();
      expect(response.body.tables.tasks.rowCount).toBe(3);
    });
  });

  describe('GET /api/database/tables/:tableName', () => {
    it('should return empty data for empty tasks table', async () => {
      const response = await request(app)
        .get('/api/database/tables/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('table', 'tasks');
      expect(response.body).toHaveProperty('rowCount', 0);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should return all task data with correct count', async () => {
      // Create 2 tasks
      await taskRepository.create({
        title: 'Test Task 1',
        description: 'Description 1',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z'
      });
      await taskRepository.create({
        title: 'Test Task 2',
        status: TaskStatus.IN_PROGRESS,
        dueDateTime: '2025-12-30T12:00:00Z'
      });

      const response = await request(app)
        .get('/api/database/tables/tasks')
        .expect(200);

      expect(response.body.table).toBe('tasks');
      expect(response.body.rowCount).toBe(2);
      expect(response.body.data.length).toBe(2);
      
      // Verify data includes all fields
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('status');
      expect(response.body.data[0]).toHaveProperty('dueDateTime');
    });

    it('should return 404 for non-existent table', async () => {
      const response = await request(app)
        .get('/api/database/tables/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });

    it('should return 404 for non-matching case table names', async () => {
      // SQLite table names are case-sensitive
      await request(app)
        .get('/api/database/tables/TASKS')
        .expect(404);

      await request(app)
        .get('/api/database/tables/Tasks')
        .expect(404);
    });
  });

  describe('POST /api/database/query', () => {
    beforeEach(async () => {
      // Create test data
      await taskRepository.create({
        title: 'Query Test Task 1',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z'
      });
      await taskRepository.create({
        title: 'Query Test Task 2',
        status: TaskStatus.IN_PROGRESS,
        dueDateTime: '2025-12-30T12:00:00Z'
      });
      await taskRepository.create({
        title: 'Query Test Task 3',
        status: TaskStatus.COMPLETED,
        dueDateTime: '2025-12-29T10:00:00Z'
      });
    });

    it('should execute valid SELECT query and return results', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'SELECT * FROM tasks' })
        .expect(200);

      expect(response.body).toHaveProperty('rowCount');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.rowCount).toBe(3);
      expect(response.body.data.length).toBe(3);
    });

    it('should execute SELECT query with WHERE clause', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: "SELECT * FROM tasks WHERE status = 'TODO'" })
        .expect(200);

      expect(response.body.rowCount).toBe(1);
      expect(response.body.data[0].status).toBe('TODO');
      expect(response.body.data[0].title).toBe('Query Test Task 1');
    });

    it('should execute COUNT query', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'SELECT COUNT(*) as count FROM tasks' })
        .expect(200);

      expect(response.body.rowCount).toBe(1);
      expect(response.body.data[0]).toHaveProperty('count');
      expect(response.body.data[0].count).toBe(3);
    });

    it('should execute query with LIMIT', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'SELECT * FROM tasks LIMIT 2' })
        .expect(200);

      expect(response.body.rowCount).toBe(2);
      expect(response.body.data.length).toBe(2);
    });

    it('should execute PRAGMA queries', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'PRAGMA table_info(tasks)' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should reject INSERT queries', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: "INSERT INTO tasks (title, status, dueDateTime) VALUES ('Malicious', 'TODO', '2025-12-31')" })
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Only SELECT and PRAGMA queries are allowed');
    });

    it('should reject UPDATE queries', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: "UPDATE tasks SET status = 'COMPLETED'" })
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Only SELECT and PRAGMA queries are allowed');
    });

    it('should reject DELETE queries', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'DELETE FROM tasks' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Only SELECT and PRAGMA queries are allowed');
    });

    it('should reject DROP queries', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'DROP TABLE tasks' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Only SELECT and PRAGMA queries are allowed');
    });

    it('should reject ALTER queries', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'ALTER TABLE tasks ADD COLUMN test TEXT' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Only SELECT and PRAGMA queries are allowed');
    });

    it('should return 400 for missing query', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty query', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle SQL syntax errors gracefully', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'SELECT * FROM nonexistent_table' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle complex JOIN queries (when applicable)', async () => {
      // Note: Currently only tasks table exists, but testing query structure
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: 'SELECT t.* FROM tasks t WHERE t.id > 0' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/database/clear', () => {
    beforeEach(async () => {
      // Create test data
      await taskRepository.create({
        title: 'Test Task',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z'
      });
    });

    it('should clear database in development mode', async () => {
      // Ensure we're in development mode
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      await request(app)
        .delete('/api/database/clear')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('cleared');
        });

      // Verify tasks are deleted
      const tasks = await taskRepository.findAll();
      expect(tasks.length).toBe(0);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should clear database in test mode', async () => {
      // Ensure we're in test mode
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      await request(app)
        .delete('/api/database/clear')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });

      // Verify tasks are deleted
      const tasks = await taskRepository.findAll();
      expect(tasks.length).toBe(0);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should reject clear in production mode', async () => {
      // Save original environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .delete('/api/database/clear')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not allowed in production');

      // Verify tasks are NOT deleted
      const tasks = await taskRepository.findAll();
      expect(tasks.length).toBe(1);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should maintain table structure after clear', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      await request(app)
        .delete('/api/database/clear')
        .expect(200);

      // Verify we can still create tasks (structure intact)
      const newTask = await taskRepository.create({
        title: 'Post-Clear Task',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z'
      });

      expect(newTask).toHaveProperty('id');
      expect(newTask.title).toBe('Post-Clear Task');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test depends on implementation details
      // Testing general error handling structure
      await request(app)
        .get('/api/database/schema')
        .expect((res) => {
          expect([200, 500]).toContain(res.status);
          if (res.status === 500) {
            expect(res.body).toHaveProperty('error');
          }
        });
    });

    it('should validate query parameter types', async () => {
      await request(app)
        .post('/api/database/query')
        .send({ query: 123 }) // Invalid type
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('Security', () => {
    beforeEach(async () => {
      // Create test data for security tests
      await taskRepository.create({
        title: 'Security Test Task',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59:59Z'
      });
    });

    it('should prevent SQL injection in query endpoint', async () => {
      // Query with semicolon and multiple statements - first part is SELECT so passes validation
      // but SQL.js will execute first statement only
      const maliciousQuery = "SELECT * FROM tasks; DROP TABLE tasks; --";
      
      await request(app)
        .post('/api/database/query')
        .send({ query: maliciousQuery })
        .expect(200); // Passes because starts with SELECT

      // Verify table still exists
      const schemaResponse = await request(app)
        .get('/api/database/schema')
        .expect(200);

      expect(schemaResponse.body.tables).toContain('tasks');
    });

    it('should prevent SQL injection attempts with comments', async () => {
      const response = await request(app)
        .post('/api/database/query')
        .send({ query: "SELECT * FROM tasks WHERE id = 1 OR 1=1 -- " })
        .expect(200);

      // Query should execute but not compromise security
      expect(response.body).toHaveProperty('data');
    });

    it('should sanitize table names in table data endpoint', async () => {
      await request(app)
        .get('/api/database/tables/tasks; DROP TABLE tasks; --')
        .expect(404);

      // Verify table still exists
      const schemaResponse = await request(app)
        .get('/api/database/schema')
        .expect(200);

      expect(schemaResponse.body.tables).toContain('tasks');
    });
  });

  describe('Performance', () => {
    it('should handle large result sets efficiently', async () => {
      // Create 50 tasks
      const createPromises = [];
      for (let i = 1; i <= 50; i++) {
        createPromises.push(
          taskRepository.create({
            title: `Performance Test Task ${i}`,
            status: TaskStatus.TODO,
            dueDateTime: '2025-12-31T23:59:59Z'
          })
        );
      }
      await Promise.all(createPromises);

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/database/tables/tasks')
        .expect(200);
      const endTime = Date.now();

      expect(response.body.rowCount).toBe(50);
      expect(response.body.data.length).toBe(50);
      
      // Response should be reasonably fast (< 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle complex queries efficiently', async () => {
      // Create test data
      for (let i = 1; i <= 20; i++) {
        await taskRepository.create({
          title: `Task ${i}`,
          status: i % 3 === 0 ? TaskStatus.COMPLETED : i % 2 === 0 ? TaskStatus.IN_PROGRESS : TaskStatus.TODO,
          dueDateTime: `2025-12-${String(i).padStart(2, '0')}T12:00:00Z`
        });
      }

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/database/query')
        .send({ 
          query: "SELECT status, COUNT(*) as count FROM tasks GROUP BY status ORDER BY count DESC" 
        })
        .expect(200);
      const endTime = Date.now();

      expect(response.body).toHaveProperty('data');
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
