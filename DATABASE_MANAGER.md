# Database Manager - User Guide

## Overview
The Database Manager is a built-in tool that provides full visibility and control over the in-memory SQL.js database. Access it directly from the application UI.

## Accessing the Database Manager

Click the **🗄️ Database** button in the top-right corner of the application header.

## Features

### 📊 Statistics Tab
View real-time database statistics:
- **Total number of tables** in the database
- **Row count** for each table
- Quick overview of database size and content

**Use cases:**
- Monitor database growth
- Verify data import/export
- Quick health check

### 📋 Schema Tab
Explore the complete database structure:
- **Table definitions** with all columns
- **Column properties:**
  - Name and data type
  - NOT NULL constraints
  - Primary key indicators
- **Indexes** on each table
- SQL schema details

**Use cases:**
- Understand data model
- Documentation reference
- Debug data issues
- Plan queries

### 📁 Data Browser Tab
Browse and inspect table data:
- **Table selector** - switch between tables
- **Live data view** - see all records in selected table
- **Row counter** - shows total records
- **Refresh button** - reload data on demand
- **Column viewer** - displays all fields

**Use cases:**
- Inspect task records
- Verify data integrity
- Debug specific records
- Export data (copy from table)

### ⚡ Query Console Tab
Execute custom SQL queries:
- **SQL editor** with syntax highlighting
- **Execute button** - run queries instantly
- **Results table** - formatted query output
- **Row count** - shows result size
- **Safety mode** - only SELECT and PRAGMA queries allowed

**Example queries:**
```sql
-- Get all tasks
SELECT * FROM tasks LIMIT 10

-- Count tasks by status
SELECT status, COUNT(*) as count 
FROM tasks 
GROUP BY status

-- Find overdue tasks
SELECT * FROM tasks 
WHERE dueDateTime < datetime('now')

-- Get table info
PRAGMA table_info(tasks)
```

**Use cases:**
- Advanced filtering
- Data analysis
- Performance testing
- Learning SQL

## Management Actions

### 🔄 Refresh
- Updates all database information
- Reloads current view
- Located in top-right header

### 🗑️ Clear Database
- **Removes all data** from all tables
- Preserves table structure
- **⚠️ Warning:** Cannot be undone!
- Confirmation dialog before execution
- **Development only** - disabled in production

**Use cases:**
- Reset development environment
- Clear test data
- Start fresh

## Safety Features

### Query Restrictions
- **Only SELECT queries** allowed in Query Console
- **PRAGMA commands** permitted (metadata only)
- **Write operations disabled** (INSERT, UPDATE, DELETE)
- Prevents accidental data corruption

### Production Protection
- **Clear Database disabled** in production mode
- Automatic environment detection
- Safeguards production data

### Error Handling
- User-friendly error messages
- Query validation before execution
- Automatic error recovery

## Tips & Best Practices

### Performance
- Use **LIMIT** clause for large tables
- Refresh only when needed
- Close unused tabs

### Data Inspection
1. Check **Statistics** first for overview
2. Use **Schema** to understand structure
3. Browse **Data** for specific records
4. Use **Query Console** for complex filtering

### Development Workflow
1. Create tasks via UI
2. Verify in **Data Browser**
3. Check counts in **Statistics**
4. Test queries in **Query Console**
5. Clear database when starting new tests

### SQL Query Examples

**Filter by status:**
```sql
SELECT * FROM tasks WHERE status = 'TODO'
```

**Sort by due date:**
```sql
SELECT * FROM tasks ORDER BY dueDateTime ASC
```

**Search by title:**
```sql
SELECT * FROM tasks WHERE title LIKE '%project%'
```

**Get recent tasks:**
```sql
SELECT * FROM tasks 
ORDER BY createdAt DESC 
LIMIT 5
```

**Aggregate statistics:**
```sql
SELECT 
  status,
  COUNT(*) as total,
  AVG(JULIANDAY(dueDateTime) - JULIANDAY(createdAt)) as avg_duration_days
FROM tasks
GROUP BY status
```

## Architecture

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/database/schema` | GET | Get database schema |
| `/api/database/stats` | GET | Get statistics |
| `/api/database/tables/:name` | GET | Get table data |
| `/api/database/query` | POST | Execute SQL query |
| `/api/database/clear` | DELETE | Clear all data |

### Frontend Components

- **DatabaseManager.tsx** - Main component with tabs
- **DatabaseManager.css** - Styling
- **databaseService.ts** - API communication
- **database.types.ts** - TypeScript interfaces

### Data Flow

```
User Action → Component → Service → Backend API → Database Adapter → SQL.js
     ↓                                    ↓
  UI Update ← Format Result ← JSON Response ← Query Result
```

## Troubleshooting

### "Failed to load database information"
- Check backend is running (port 3001)
- Verify API endpoint accessibility
- Check browser console for details

### "Query execution failed"
- Verify SQL syntax
- Ensure using SELECT or PRAGMA only
- Check table/column names exist

### "Table not found"
- Refresh database schema
- Verify table name spelling
- Check if database was cleared

### Empty results
- Normal if no data exists
- Try creating some tasks first
- Use Statistics tab to verify table existence

## Security Notes

- Database Manager is for **development use**
- Consider authentication for production
- Query console limited to read-only operations
- Clear database disabled in production
- No sensitive data exposure (controlled endpoints)

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- Modern browsers with ES6+ support

## Keyboard Shortcuts

- **Ctrl+Enter** in Query Console - Execute query (coming soon)
- **Tab key** - Navigate between tabs
- **Esc** - Close error messages

## Known Limitations

1. **In-Memory Database**
   - Data cleared on server restart
   - No persistence in development
   - Use production PostgreSQL for permanent storage

2. **Query Console**
   - Read-only operations only
   - No multi-statement support
   - No stored procedures

3. **Data Browser**
   - Shows all rows (no pagination yet)
   - May be slow for large tables
   - Use Query Console with LIMIT for better performance

## Future Enhancements

- [ ] Export data to CSV/JSON
- [ ] Import data from files
- [ ] Query history
- [ ] Saved queries
- [ ] Keyboard shortcuts
- [ ] Dark/light theme toggle
- [ ] Pagination for large tables
- [ ] Column sorting and filtering
- [ ] Data visualization
- [ ] Query performance metrics

## Support

For issues or questions:
1. Check this documentation
2. Review console errors
3. Verify backend logs
4. Check API endpoint responses
5. Restart development server

---

**Quick Access:** Click **🗄️ Database** button in app header to open Database Manager.
