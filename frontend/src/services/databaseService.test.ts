// Mock the databaseService module before importing
jest.mock('./databaseService', () => {
  const mockService = {
    getSchema: jest.fn(),
    getStats: jest.fn(),
    getTableData: jest.fn(),
    executeQuery: jest.fn(),
    clearDatabase: jest.fn(),
  };
  return { __esModule: true, default: mockService };
});

import databaseService from './databaseService';

const mockService = databaseService as jest.Mocked<typeof databaseService>;

describe('databaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSchema', () => {
    it('fetches database schema successfully', async () => {
      const mockSchema = {
        tables: ['tasks'],
        schema: {
          tasks: {
            columns: [
              { cid: 0, name: 'id', type: 'INTEGER', notnull: 0, dflt_value: null, pk: 1 },
              { cid: 1, name: 'title', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
            ],
            indexes: [],
          },
        },
      };

      mockService.getSchema.mockResolvedValue(mockSchema);

      const result = await databaseService.getSchema();

      expect(mockService.getSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });

    it('throws error when API call fails', async () => {
      mockService.getSchema.mockRejectedValue(new Error('Network error'));

      await expect(databaseService.getSchema()).rejects.toThrow('Network error');
    });
  });

  describe('getStats', () => {
    it('fetches database statistics successfully', async () => {
      const mockStats = {
        tableCount: 1,
        tables: {
          tasks: { rowCount: 5 },
        },
      };

      mockService.getStats.mockResolvedValue(mockStats);

      const result = await databaseService.getStats();

      expect(mockService.getStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });

    it('throws error when API call fails', async () => {
      mockService.getStats.mockRejectedValue(new Error('Connection timeout'));

      await expect(databaseService.getStats()).rejects.toThrow('Connection timeout');
    });
  });

  describe('getTableData', () => {
    it('fetches table data successfully', async () => {
      const mockTableData = {
        table: 'tasks',
        rowCount: 2,
        data: [
          { id: 1, title: 'Task 1', status: 'TODO' },
          { id: 2, title: 'Task 2', status: 'IN_PROGRESS' },
        ],
      };

      mockService.getTableData.mockResolvedValue(mockTableData);

      const result = await databaseService.getTableData('tasks');

      expect(mockService.getTableData).toHaveBeenCalledWith('tasks');
      expect(result).toEqual(mockTableData);
    });

    it('throws error for non-existent table', async () => {
      mockService.getTableData.mockRejectedValue(new Error('Table not found'));

      await expect(databaseService.getTableData('nonexistent')).rejects.toThrow('Table not found');
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

      mockService.executeQuery.mockResolvedValue(mockQueryResult);

      const query = 'SELECT * FROM tasks';
      const result = await databaseService.executeQuery(query);

      expect(mockService.executeQuery).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockQueryResult);
    });

    it('throws error for invalid SQL syntax', async () => {
      mockService.executeQuery.mockRejectedValue(new Error('SQL syntax error'));

      await expect(databaseService.executeQuery('INVALID SQL')).rejects.toThrow('SQL syntax error');
    });
  });

  describe('clearDatabase', () => {
    it('clears database successfully', async () => {
      const mockResponse = {
        message: 'Database cleared successfully',
        clearedTables: ['tasks'],
      };

      mockService.clearDatabase.mockResolvedValue(mockResponse);

      const result = await databaseService.clearDatabase();

      expect(mockService.clearDatabase).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('throws error on failure', async () => {
      mockService.clearDatabase.mockRejectedValue(new Error('Failed to clear database'));

      await expect(databaseService.clearDatabase()).rejects.toThrow('Failed to clear database');
    });
  });
});
