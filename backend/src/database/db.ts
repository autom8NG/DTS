import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import pg from 'pg';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = !isProduction && !isTest;

// Database interface to abstract SQL.js and PostgreSQL
export interface DatabaseAdapter {
  query(sql: string, params?: any[]): Promise<QueryResult>;
  close(): Promise<void>;
}

export interface QueryResult {
  rows: any[];
  rowCount: number;
  lastInsertId?: number;
}

// SQL.js adapter for development/test (in-memory)
class SqlJsAdapter implements DatabaseAdapter {
  private db: SqlJsDatabase | null = null;

  async init() {
    const SQL = await initSqlJs();
    this.db = new SQL.Database();
    await this.createTables();
  }

  private async createTables() {
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
        dueDateTime TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_dueDateTime ON tasks(dueDateTime);
    `;

    this.db!.run(createTablesSQL);
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // For INSERT/UPDATE/DELETE
      if (sql.trim().toUpperCase().startsWith('INSERT') || 
          sql.trim().toUpperCase().startsWith('UPDATE') || 
          sql.trim().toUpperCase().startsWith('DELETE')) {
        this.db.run(sql, params);
        
        // Get last insert ID for INSERT
        if (sql.trim().toUpperCase().startsWith('INSERT')) {
          const result = this.db.exec('SELECT last_insert_rowid() as id');
          const lastInsertId = result[0]?.values[0]?.[0] as number;
          return { rows: [], rowCount: 1, lastInsertId };
        }
        
        return { rows: [], rowCount: 1 };
      }

      // For SELECT
      const result = this.db.exec(sql, params);
      if (result.length === 0) {
        return { rows: [], rowCount: 0 };
      }

      const rows = result[0].values.map(row => {
        const obj: any = {};
        result[0].columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });

      return { rows, rowCount: rows.length };
    } catch (error) {
      throw error;
    }
  }

  async close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// PostgreSQL adapter for production
class PostgresAdapter implements DatabaseAdapter {
  private pool: pg.Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async init() {
    await this.createTables();
  }

  private async createTables() {
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
        "dueDateTime" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_dueDateTime ON tasks("dueDateTime");
    `;

    await this.pool.query(createTablesSQL);
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      // Convert SQLite syntax to PostgreSQL syntax
      let pgSql = sql
        .replace(/datetime\('now'\)/g, 'CURRENT_TIMESTAMP')
        .replace(/AUTOINCREMENT/g, '')
        .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY');

      // Handle RETURNING clause for INSERT
      if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      const result = await this.pool.query(pgSql, params);
      
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
        lastInsertId: result.rows[0]?.id
      };
    } catch (error) {
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

// Factory to create appropriate database adapter
async function createDatabaseAdapter(): Promise<DatabaseAdapter> {
  if (isProduction) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL environment variable is required for production. ' +
        'Please set it to your PostgreSQL connection string.'
      );
    }
    
    console.log('🔌 Connecting to PostgreSQL database...');
    const adapter = new PostgresAdapter(databaseUrl);
    await adapter.init();
    console.log('✅ PostgreSQL database connected');
    return adapter;
  } else {
    console.log('💾 Using in-memory SQL.js database for development/testing');
    const adapter = new SqlJsAdapter();
    await adapter.init();
    console.log('✅ In-memory database initialized');
    return adapter;
  }
}

// Initialize database
let dbAdapter: DatabaseAdapter;
const dbPromise = createDatabaseAdapter().then(adapter => {
  dbAdapter = adapter;
  return adapter;
});

export { dbAdapter, dbPromise };
export default dbAdapter;
