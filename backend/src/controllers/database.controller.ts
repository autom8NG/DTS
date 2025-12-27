import { Request, Response } from 'express';
import { dbAdapter, dbPromise } from '../database/db';

export class DatabaseController {
  // Get database schema information
  async getSchema(req: Request, res: Response) {
    try {
      await dbPromise;

      // Get table information
      const tables = await dbAdapter.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        ORDER BY name
      `);

      const schema: any = {};

      for (const table of tables.rows) {
        const tableName = table.name as string;
        
        // Get columns for each table
        const columns = await dbAdapter.query(`PRAGMA table_info(${tableName})`);
        
        // Get indexes
        const indexes = await dbAdapter.query(`PRAGMA index_list(${tableName})`);
        
        schema[tableName] = {
          columns: columns.rows,
          indexes: indexes.rows
        };
      }

      return res.status(200).json({
        tables: tables.rows.map((t: any) => t.name),
        schema
      });
    } catch (error) {
      console.error('Error fetching schema:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all data from a specific table
  async getTableData(req: Request, res: Response) {
    try {
      await dbPromise;
      const { tableName } = req.params;

      // Validate table name (prevent SQL injection)
      const validTables = await dbAdapter.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
      `, [tableName]);

      if (validTables.rows.length === 0) {
        return res.status(404).json({ error: 'Table not found' });
      }

      // Get table data
      const data = await dbAdapter.query(`SELECT * FROM ${tableName}`);
      
      // Get row count
      const count = await dbAdapter.query(`SELECT COUNT(*) as count FROM ${tableName}`);

      return res.status(200).json({
        table: tableName,
        rowCount: count.rows[0].count,
        data: data.rows
      });
    } catch (error) {
      console.error('Error fetching table data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Execute a custom SQL query (read-only for safety)
  async executeQuery(req: Request, res: Response) {
    try {
      await dbPromise;
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Only allow SELECT queries for safety
      const trimmedQuery = query.trim().toUpperCase();
      if (!trimmedQuery.startsWith('SELECT') && !trimmedQuery.startsWith('PRAGMA')) {
        return res.status(403).json({ 
          error: 'Only SELECT and PRAGMA queries are allowed for safety' 
        });
      }

      const result = await dbAdapter.query(query);

      return res.status(200).json({
        rowCount: result.rowCount,
        data: result.rows
      });
    } catch (error: any) {
      console.error('Error executing query:', error);
      return res.status(400).json({ 
        error: 'Query execution failed',
        message: error.message 
      });
    }
  }

  // Get database statistics
  async getStats(req: Request, res: Response) {
    try {
      await dbPromise;

      const tables = await dbAdapter.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        ORDER BY name
      `);

      const stats: any = {
        tableCount: tables.rows.length,
        tables: {}
      };

      for (const table of tables.rows) {
        const tableName = table.name as string;
        const count = await dbAdapter.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        stats.tables[tableName] = {
          rowCount: count.rows[0].count
        };
      }

      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Clear all data from database (development only)
  async clearDatabase(req: Request, res: Response) {
    try {
      await dbPromise;

      // Only allow in development
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ 
          error: 'Database clearing is not allowed in production' 
        });
      }

      const tables = await dbAdapter.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        ORDER BY name
      `);

      for (const table of tables.rows) {
        const tableName = table.name as string;
        await dbAdapter.query(`DELETE FROM ${tableName}`);
      }

      return res.status(200).json({ 
        message: 'Database cleared successfully',
        clearedTables: tables.rows.map((t: any) => t.name)
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new DatabaseController();
