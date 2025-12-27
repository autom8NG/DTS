import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';
import { DatabaseSchema, TableData, DatabaseStats } from '../types/database.types';
import './DatabaseManager.css';

export const DatabaseManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'data' | 'query' | 'stats'>('stats');
  const [schema, setSchema] = useState<DatabaseSchema | null>(null);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [query, setQuery] = useState<string>('SELECT * FROM tasks LIMIT 10');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [schemaData, statsData] = await Promise.all([
        databaseService.getSchema(),
        databaseService.getStats()
      ]);
      setSchema(schemaData);
      setStats(statsData);
      if (schemaData.tables.length > 0) {
        setSelectedTable(schemaData.tables[0]);
      }
    } catch (err) {
      setError('Failed to load database information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await databaseService.getTableData(tableName);
      setTableData(data);
      setSelectedTable(tableName);
    } catch (err) {
      setError('Failed to load table data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await databaseService.executeQuery(query);
      setQueryResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute query');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear all data from the database? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await databaseService.clearDatabase();
      await loadInitialData();
      setTableData(null);
      setQueryResult(null);
      alert('Database cleared successfully');
    } catch (err) {
      setError('Failed to clear database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStats = () => (
    <div className="db-stats">
      <h3>Database Statistics</h3>
      {stats && (
        <>
          <div className="stat-card">
            <div className="stat-label">Total Tables</div>
            <div className="stat-value">{stats.tableCount}</div>
          </div>
          <div className="tables-stats">
            {Object.entries(stats.tables).map(([tableName, tableStats]) => (
              <div key={tableName} className="table-stat">
                <span className="table-name">{tableName}</span>
                <span className="row-count">{tableStats.rowCount} rows</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderSchema = () => (
    <div className="db-schema">
      <h3>Database Schema</h3>
      {schema && schema.tables.map((tableName) => (
        <div key={tableName} className="table-schema">
          <h4>{tableName}</h4>
          <table className="schema-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Not Null</th>
                <th>Primary Key</th>
              </tr>
            </thead>
            <tbody>
              {schema.schema[tableName]?.columns.map((col) => (
                <tr key={col.cid}>
                  <td><strong>{col.name}</strong></td>
                  <td>{col.type}</td>
                  <td>{col.notnull ? '✓' : ''}</td>
                  <td>{col.pk ? '✓' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {schema.schema[tableName]?.indexes.length > 0 && (
            <div className="indexes">
              <strong>Indexes:</strong> {schema.schema[tableName].indexes.map(idx => idx.name).join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderData = () => (
    <div className="db-data">
      <div className="table-selector">
        <label>Select Table:</label>
        <select 
          value={selectedTable} 
          onChange={(e) => loadTableData(e.target.value)}
          disabled={loading}
        >
          {schema?.tables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
        <button onClick={() => loadTableData(selectedTable)} disabled={loading}>
          Refresh
        </button>
      </div>

      {tableData && (
        <>
          <h3>{tableData.table} ({tableData.rowCount} rows)</h3>
          {tableData.data.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(tableData.data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.data.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val: any, valIdx) => (
                        <td key={valIdx}>{val !== null ? String(val) : 'NULL'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-message">No data in this table</p>
          )}
        </>
      )}
    </div>
  );

  const renderQuery = () => (
    <div className="db-query">
      <h3>SQL Query Console</h3>
      <p className="query-hint">Enter SELECT or PRAGMA queries (write operations are disabled for safety)</p>
      
      <div className="query-editor">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SELECT * FROM tasks LIMIT 10"
          rows={5}
        />
        <button onClick={executeQuery} disabled={loading || !query.trim()}>
          Execute Query
        </button>
      </div>

      {queryResult && (
        <>
          <h4>Results ({queryResult.rowCount} rows)</h4>
          {queryResult.data.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(queryResult.data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.data.map((row: any, idx: number) => (
                    <tr key={idx}>
                      {Object.values(row).map((val: any, valIdx) => (
                        <td key={valIdx}>{val !== null ? String(val) : 'NULL'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-message">Query returned no results</p>
          )}
        </>
      )}
    </div>
  );

  if (loading && !schema) {
    return <div className="db-manager loading">Loading database manager...</div>;
  }

  return (
    <div className="db-manager">
      <div className="db-header">
        <h2>🗄️ Database Manager</h2>
        <div className="db-actions">
          <button onClick={loadInitialData} disabled={loading} className="btn-refresh">
            🔄 Refresh
          </button>
          <button onClick={clearDatabase} disabled={loading} className="btn-clear">
            🗑️ Clear Database
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="db-tabs">
        <button 
          className={activeTab === 'stats' ? 'active' : ''} 
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button 
          className={activeTab === 'schema' ? 'active' : ''} 
          onClick={() => setActiveTab('schema')}
        >
          📋 Schema
        </button>
        <button 
          className={activeTab === 'data' ? 'active' : ''} 
          onClick={() => setActiveTab('data')}
        >
          📁 Data Browser
        </button>
        <button 
          className={activeTab === 'query' ? 'active' : ''} 
          onClick={() => setActiveTab('query')}
        >
          ⚡ Query Console
        </button>
      </div>

      <div className="db-content">
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'schema' && renderSchema()}
        {activeTab === 'data' && renderData()}
        {activeTab === 'query' && renderQuery()}
      </div>
    </div>
  );
};
