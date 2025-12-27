import axios from 'axios';
import { DatabaseSchema, TableData, DatabaseStats, QueryResult } from '../types/database.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

class DatabaseService {
  // Get database schema
  async getSchema(): Promise<DatabaseSchema> {
    const response = await api.get<DatabaseSchema>('/api/database/schema');
    return response.data;
  }

  // Get database statistics
  async getStats(): Promise<DatabaseStats> {
    const response = await api.get<DatabaseStats>('/api/database/stats');
    return response.data;
  }

  // Get data from specific table
  async getTableData(tableName: string): Promise<TableData> {
    const response = await api.get<TableData>(`/api/database/tables/${tableName}`);
    return response.data;
  }

  // Execute custom query
  async executeQuery(query: string): Promise<QueryResult> {
    const response = await api.post<QueryResult>('/api/database/query', { query });
    return response.data;
  }

  // Clear database
  async clearDatabase(): Promise<{ message: string; clearedTables: string[] }> {
    const response = await api.delete('/api/database/clear');
    return response.data;
  }
}

export default new DatabaseService();
