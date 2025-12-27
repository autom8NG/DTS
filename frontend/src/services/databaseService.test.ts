import axios from 'axios';
import databaseService from './databaseService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a mock axios instance
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

// Mock axios.create to return our mock instance
mockedAxios.create = jest.fn(() => mockAxiosInstance as any);

describe('databaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSchema', () => {
    it('fetches database schema successfully', async () => {
      const mockSchema = {
        tables: ['tasks', 'sqlite_sequence'],
        schema: {
          tasks: {
            columns: [
              { cid: 0, name: 'id', type: 'INTEGER', notnull: 0, dflt_value: null, pk: 1 },
              { cid: 1, name: 'title', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
            ],
            indexes: [
              { name: 'idx_tasks_status', origin: 'c', unique: 0 },
            ],
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockSchema });

      const result = await databaseService.getSchema();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/database/schema');
      expect(result).toEqual(mockSchema);
    });

    it('throws error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(databaseService.getSchema()).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/database/schema');
    });

    it('handles 500 server error', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(databaseService.getSchema()).rejects.toEqual(errorResponse);
    });

    it('returns empty schema when no tables exist', async () => {
      const emptySchema = {
        tables: [],
        schema: {},
      };

      mockAxiosInstance.get.mockResolvedValue({ data: emptySchema });

      const result = await databaseService.getSchema();

      expect(result.tables).toHaveLength(0);
      expect(result.schema).toEqual({});
    });
  });

  describe('getStats', () => {
    it('fetches database statistics successfully', async () => {
      const mockStats = {
        tableCount: 2,
        tables: {
          tasks: { rowCount: 5 },
          sqlite_sequence: { rowCount: 1 },
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockStats });

      const result = await databaseService.getStats();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/database/stats');
      expect(result).toEqual(mockStats);
      expect(result.tableCount).toBe(2);
      expect(result.tables.tasks.rowCount).toBe(5);
    });

    it('throws error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Connection timeout'));

      await expect(databaseService.getStats()).rejects.toThrow('Connection timeout');
    });

    it('handles empty database statistics', async () => {
      const emptyStats = {
        tableCount: 0,
        tables: {},
      };

      mockAxiosInstance.get.mockResolvedValue({ data: emptyStats });

      const result = await databaseService.getStats();

      expect(result.tableCount).toBe(0);
      expect(Object.keys(result.tables)).toHaveLength(0);
    });
  });

  describe('getTableData', () => {
    it('fetches table data successfully', async () => {
      const mockTableData = {
        table: 'tasks',
        rowCount: 3,
        data: [
          { id: 1, title: 'Task 1', status: 'TODO', dueDateTime: '2025-12-31T23:59:59Z' },
          { id: 2, title: 'Task 2', status: 'IN_PROGRESS', dueDateTime: '2025-12-30T12:00:00Z' },
          { id: 3, title: 'Task 3', status: 'COMPLETED', dueDateTime: '2025-12-29T10:00:00Z' },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockTableData });

      const result = await databaseService.getTableData('tasks');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/database/tables/tasks');
      expect(result).toEqual(mockTableData);
      expect(result.data).toHaveLength(3);
    });

    it('throws error for non-existent table', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { error: 'Table not found' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(databaseService.getTableData('nonexistent')).rejects.toEqual(errorResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/database/tables/nonexistent');
    });

    it('returns empty data array for empty table', async () => {
      const emptyTableData = {
        table: 'tasks',
        rowCount: 0,
        data: [],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: emptyTableData });

      const result = await databaseService.getTableData('tasks');

      expect(result.rowCount).toBe(0);
      expect(result.data).toHaveLength(0);
    });

    it('handles special characters in table name', async () => {
      const mockTableData = {
        table: 'table_with_underscore',
        rowCount: 1,
        data: [{ id: 1 }],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockTableData });

      await databaseService.getTableData('table_with_underscore');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/database/tables/table_with_underscore');
    });
  });

  describe('executeQuery', () => {
    it('executes SELECT query successfully', async () => {
      const mockQueryResult = {
        rowCount: 2,
        data: [
          { id: 1, title: 'Task 1' },
          { id: 2, title: 'Task 2' },
        ],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockQueryResult });

      const query = 'SELECT * FROM tasks WHERE status = "TODO"';
      const result = await databaseService.executeQuery(query);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/database/query', { query });
      expect(result).toEqual(mockQueryResult);
      expect(result.data).toHaveLength(2);
    });

    it('throws error for invalid SQL syntax', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'SQL syntax error' },
        },
      };

      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(databaseService.executeQuery('INVALID SQL')).rejects.toEqual(errorResponse);
    });

    it('prevents SQL injection attempts', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'SQL injection attempt detected' },
        },
      };

      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      const maliciousQuery = "SELECT * FROM tasks WHERE id = 1; DROP TABLE tasks; --";
      
      await expect(databaseService.executeQuery(maliciousQuery)).rejects.toEqual(errorResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/database/query', {
        query: maliciousQuery,
      });
    });

    it('handles INSERT query with rowCount', async () => {
      const mockInsertResult = {
        rowCount: 1,
        data: [],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockInsertResult });

      const insertQuery = 'INSERT INTO tasks (title, status) VALUES ("New Task", "TODO")';
      const result = await databaseService.executeQuery(insertQuery);

      expect(result.rowCount).toBe(1);
      expect(result.data).toHaveLength(0);
    });

    it('handles UPDATE query', async () => {
      const mockUpdateResult = {
        rowCount: 3,
        data: [],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockUpdateResult });

      const updateQuery = 'UPDATE tasks SET status = "COMPLETED" WHERE status = "TODO"';
      const result = await databaseService.executeQuery(updateQuery);

      expect(result.rowCount).toBe(3);
    });

    it('handles DELETE query', async () => {
      const mockDeleteResult = {
        rowCount: 2,
        data: [],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockDeleteResult });

      const deleteQuery = 'DELETE FROM tasks WHERE status = "COMPLETED"';
      const result = await databaseService.executeQuery(deleteQuery);

      expect(result.rowCount).toBe(2);
    });

    it('handles empty query result', async () => {
      const emptyResult = {
        rowCount: 0,
        data: [],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: emptyResult });

      const result = await databaseService.executeQuery('SELECT * FROM tasks WHERE id = 999');

      expect(result.rowCount).toBe(0);
      expect(result.data).toHaveLength(0);
    });

    it('handles complex JOIN query', async () => {
      const mockJoinResult = {
        rowCount: 5,
        data: [
          { task_id: 1, task_title: 'Task 1', user_name: 'John' },
          { task_id: 2, task_title: 'Task 2', user_name: 'Jane' },
        ],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockJoinResult });

      const joinQuery = 'SELECT t.id as task_id, t.title as task_title, u.name as user_name FROM tasks t JOIN users u ON t.user_id = u.id';
      const result = await databaseService.executeQuery(joinQuery);

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('task_id');
      expect(result.data[0]).toHaveProperty('user_name');
    });
  });

  describe('clearDatabase', () => {
    it('clears database successfully in development mode', async () => {
      const mockResponse = {
        message: 'Database cleared successfully',
        clearedTables: ['tasks'],
      };

      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

      const result = await databaseService.clearDatabase();

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/database/clear');
      expect(result).toEqual(mockResponse);
      expect(result.message).toContain('cleared successfully');
    });

    it('throws error in production mode', async () => {
      const errorResponse = {
        response: {
          status: 403,
          data: { error: 'Database clear is only allowed in development mode' },
        },
      };

      mockAxiosInstance.delete.mockRejectedValue(errorResponse);

      await expect(databaseService.clearDatabase()).rejects.toEqual(errorResponse);
    });

    it('handles network error during clear', async () => {
      mockAxiosInstance.delete.mockRejectedValue(new Error('Network error'));

      await expect(databaseService.clearDatabase()).rejects.toThrow('Network error');
    });

    it('handles server error during clear', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { error: 'Failed to clear database' },
        },
      };

      mockAxiosInstance.delete.mockRejectedValue(errorResponse);

      await expect(databaseService.clearDatabase()).rejects.toEqual(errorResponse);
    });
  });

  describe('Error Response Handling', () => {
    it('handles 401 unauthorized error', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(databaseService.getStats()).rejects.toEqual(errorResponse);
    });

    it('handles 403 forbidden error', async () => {
      const errorResponse = {
        response: {
          status: 403,
          data: { error: 'Forbidden' },
        },
      };

      mockAxiosInstance.delete.mockRejectedValue(errorResponse);

      await expect(databaseService.clearDatabase()).rejects.toEqual(errorResponse);
    });

    it('handles network timeout', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      };

      mockAxiosInstance.get.mockRejectedValue(timeoutError);

      await expect(databaseService.getSchema()).rejects.toEqual(timeoutError);
    });
  });

  describe('Request Headers and Configuration', () => {
    it('sends requests with correct content type', async () => {
      const mockResponse = { data: { rowCount: 0, data: [] } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      await databaseService.executeQuery('SELECT 1');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/database/query',
        expect.objectContaining({ query: 'SELECT 1' })
      );
    });

    it('handles request cancellation', async () => {
      const cancelError = {
        message: 'Request cancelled',
        __CANCEL__: true,
      };

      mockAxiosInstance.get.mockRejectedValue(cancelError);

      await expect(databaseService.getSchema()).rejects.toEqual(cancelError);
    });
  });
});
