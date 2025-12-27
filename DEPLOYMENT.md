# Production Deployment Guide

## Database Configuration

This application uses different database systems for different environments:

### Development & Testing
- **Database:** SQL.js (in-memory)
- **Configuration:** No setup required
- **Pros:** Zero installation, fast, perfect for development

### Production
- **Database:** PostgreSQL
- **Configuration:** Required
- **Pros:** Production-ready, scalable, ACID compliant

## Environment Variables

### Development (.env)
```env
NODE_ENV=development
PORT=3001
```

### Production (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

## PostgreSQL Setup

### Local PostgreSQL Installation

1. **Install PostgreSQL:**
   ```bash
   # Windows (via Chocolatey)
   choco install postgresql

   # macOS
   brew install postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql
   ```

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE dts_tasks;

   # Create user (optional)
   CREATE USER dts_admin WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE dts_tasks TO dts_admin;
   ```

3. **Set DATABASE_URL:**
   ```env
   DATABASE_URL=postgresql://dts_admin:your_password@localhost:5432/dts_tasks
   ```

### Cloud Database Options

#### 1. AWS RDS (Amazon)
```env
DATABASE_URL=postgresql://admin:password@mydb.abc123.us-east-1.rds.amazonaws.com:5432/dts_tasks
```

#### 2. Azure Database for PostgreSQL
```env
DATABASE_URL=postgresql://admin@myserver:password@myserver.postgres.database.azure.com:5432/dts_tasks
```

#### 3. Heroku Postgres
```env
DATABASE_URL=postgresql://user:password@ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com:5432/dbname
```

#### 4. Supabase
```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

#### 5. Railway
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xx.railway.app:5432/railway
```

## Deployment Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build Application
```bash
npm run build
```

### 3. Set Environment Variables
Create a `.env` file or set environment variables in your hosting platform:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://your-connection-string
```

### 4. Run Migrations (if needed)
The application automatically creates tables on startup. For production, you may want to run migrations separately:

```bash
# The app will create tables automatically when it starts
npm start
```

### 5. Start Application
```bash
npm start
```

## Deployment Platforms

### Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: dts_tasks
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://admin:password@postgres:5432/dts_tasks
    ports:
      - "3001:3001"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Heroku

1. **Install Heroku CLI**
2. **Create App:**
   ```bash
   heroku create dts-task-management
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Railway

1. **Connect GitHub repository**
2. **Add PostgreSQL service**
3. **Set environment variables:**
   - `NODE_ENV=production`
   - Railway will automatically set `DATABASE_URL`

### Azure

1. **Create App Service**
2. **Create Azure Database for PostgreSQL**
3. **Set Connection String in Configuration**
4. **Deploy via GitHub Actions or Azure CLI**

## Database Schema

The application automatically creates the following schema:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
  "dueDateTime" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_dueDateTime ON tasks("dueDateTime");
```

## Environment Detection

The application automatically detects the environment:

- **`NODE_ENV=development`** → SQL.js (in-memory)
- **`NODE_ENV=test`** → SQL.js (in-memory)
- **`NODE_ENV=production`** → PostgreSQL (requires DATABASE_URL)

## Monitoring & Health Checks

The API includes a health check endpoint:

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-27T14:00:00.000Z"
}
```

## Security Recommendations

1. **Never commit `.env` files**
2. **Use strong passwords for database**
3. **Enable SSL for database connections in production**
4. **Use connection pooling**
5. **Set up database backups**
6. **Monitor database performance**
7. **Use environment-specific configuration**

## Troubleshooting

### Database Connection Issues

1. **Check DATABASE_URL format:**
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]
   ```

2. **Verify database is accessible:**
   ```bash
   psql $DATABASE_URL
   ```

3. **Check firewall rules** (for cloud databases)

4. **Verify SSL requirements** (some cloud providers require SSL)

### Production Errors

Check application logs:
```bash
# Heroku
heroku logs --tail

# Docker
docker logs container_name

# PM2
pm2 logs
```

## Performance Optimization

1. **Enable connection pooling** (already configured)
2. **Add database indexes** (already configured for status and dueDateTime)
3. **Use caching** (Redis recommended for high-traffic scenarios)
4. **Monitor query performance**
5. **Set up database read replicas** for scaling

## Backup Strategy

1. **Automated backups** (enabled by default on most cloud providers)
2. **Point-in-time recovery** (available on AWS RDS, Azure)
3. **Regular backup testing**
4. **Off-site backup storage**
