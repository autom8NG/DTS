# Database Configuration Summary

## Overview
This application uses **in-memory SQL.js for development** and **PostgreSQL for production**.

## Why This Approach?

### Development Benefits
✅ **Zero Setup** - No database installation needed  
✅ **Fast Testing** - In-memory database for instant test execution  
✅ **Easy Onboarding** - New developers can start immediately  
✅ **Cross-Platform** - Works identically on Windows, Mac, Linux  

### Production Benefits
✅ **Production-Ready** - PostgreSQL is battle-tested at scale  
✅ **Data Persistence** - Real database with ACID guarantees  
✅ **Advanced Features** - Transactions, replication, backups  
✅ **Cloud-Ready** - Supported by all major cloud providers  

## Quick Start

### Development (Current Setup)
```bash
npm run dev
# That's it! Database is automatic
```

### Production Deployment
```bash
# 1. Set environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://user:password@host:5432/dbname

# 2. Run application
npm start
```

## Environment Configuration

| Environment | Database | Configuration Required |
|-------------|----------|------------------------|
| Development | SQL.js (in-memory) | None ✅ |
| Test | SQL.js (in-memory) | None ✅ |
| Production | PostgreSQL | DATABASE_URL required |

## Production Setup Options

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
choco install postgresql # Windows

# Create database
createdb dts_tasks

# Set environment
export DATABASE_URL=postgresql://localhost:5432/dts_tasks
```

### Option 2: Cloud Database (Recommended)

#### Supabase (Free Tier Available)
1. Create account at supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Set `DATABASE_URL` environment variable

#### Railway (Free Tier Available)
1. Create account at railway.app
2. Add PostgreSQL service
3. Copy `DATABASE_URL` from service variables
4. Set environment variable

#### Heroku Postgres
```bash
heroku addons:create heroku-postgresql:mini
# DATABASE_URL is set automatically
```

### Option 3: Docker (For Testing Production Locally)
```bash
# Start PostgreSQL in Docker
docker run --name postgres-dev \
  -e POSTGRES_DB=dts_tasks \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine

# Set environment
export NODE_ENV=production
export DATABASE_URL=postgresql://admin:password@localhost:5432/dts_tasks

# Run application
npm start
```

## Database Schema

Both SQL.js and PostgreSQL use the same schema (syntax is automatically converted):

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY / SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) CHECK(status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
  dueDateTime TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Verification

### Check Current Database
```bash
# Development - should show SQL.js
npm run dev
# Console output: "💾 Using in-memory SQL.js database for development/testing"

# Production - should show PostgreSQL  
NODE_ENV=production DATABASE_URL=postgresql://... npm start
# Console output: "🔌 Connecting to PostgreSQL database..."
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3001/health

# Create task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "dueDateTime": "2025-12-31T23:59:59Z"
  }'
```

## Migration from Development to Production

**No migration needed!** The application automatically:
1. Detects the environment (`NODE_ENV`)
2. Selects the appropriate database
3. Creates tables if they don't exist
4. Uses the correct SQL syntax for each database

## Troubleshooting

### "DATABASE_URL is required for production"
**Solution:** Set the DATABASE_URL environment variable
```bash
export DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### "Cannot connect to PostgreSQL"
**Check:**
1. Database server is running
2. Credentials are correct
3. Host/port are accessible
4. Firewall allows connection
5. SSL requirements (some cloud databases require SSL)

### "Development database not persisting"
**This is expected!** Development uses in-memory database. Data resets on restart.  
**For persistent dev data:** Use Docker PostgreSQL option above.

## Best Practices

### Development
- Keep using in-memory database for speed
- Use `npm test` for fast test execution
- No backup needed (data is temporary)

### Production
- Always set `NODE_ENV=production`
- Use connection pooling (already configured)
- Enable database backups
- Monitor database performance
- Use read replicas for scale
- Set up automated database migrations

## Additional Resources

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- PostgreSQL docs: https://www.postgresql.org/docs/
- SQL.js docs: https://sql.js.org/
- Cloud database comparison: See DEPLOYMENT.md
