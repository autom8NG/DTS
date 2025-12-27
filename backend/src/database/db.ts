import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.db');
const isTest = process.env.NODE_ENV === 'test';

// Use in-memory database for tests
const db = isTest ? new Database(':memory:') : new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
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

db.exec(createTablesSQL);

export default db;
