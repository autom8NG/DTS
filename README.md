# DTS Task Management System

A full-stack task management application built for the HMCTS DTS Developer Technical Challenge. This system allows caseworkers to efficiently create, view, update, and delete tasks with comprehensive validation, error handling, and testing.

## ⚡ Quick Start (3 Steps)

### 1. Install All Dependencies
```bash
npm run install:all
```
This installs dependencies for root project (concurrently), backend (Express, SQLite, TypeScript), and frontend (React, Vite, TypeScript).

### 2. Run the Application
```bash
npm run dev
```
This uses **concurrently** to start both servers:
- Backend API: http://localhost:3001
- Frontend UI: http://localhost:3000

### 3. Test the Application
```bash
npm test
```
This runs all tests for both backend and frontend using **concurrently**.

## 🚀 Features

### Backend API
- **RESTful API** with 5 core endpoints
- **CRUD Operations**: Create, Read, Update, and Delete tasks
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Robust error handling with meaningful error messages
- **Database**: SQLite database with proper indexing
- **Testing**: 70%+ code coverage with Jest

### Frontend Application
- **React + TypeScript**: Modern, type-safe frontend
- **Responsive UI**: User-friendly interface with real-time updates
- **Task Management**: Complete CRUD functionality
- **Status Tracking**: Visual status indicators (TODO, IN_PROGRESS, COMPLETED)
- **Form Validation**: Client-side validation with user feedback
- **Database Manager**: Built-in database browser and query console
- **Testing**: Comprehensive unit tests for all components

## 🗄️ Database Manager

The Database Manager is a built-in tool providing full visibility and control over the database:

### Features

#### 📊 Statistics Tab
- View total number of tables
- See row count for each table
- Monitor database growth in real-time

#### 📋 Schema Tab
- Explore complete database structure
- View column properties (name, type, constraints)
- Inspect indexes and primary keys
- Reference SQL schema details

#### 📁 Data Browser Tab
- Browse and inspect all table data
- Switch between tables with dropdown selector
- View live data with refresh capability
- Export data by copying from table

#### ⚡ Query Console Tab
- Execute custom SQL queries
- Syntax-highlighted SQL editor
- Formatted results table
- Safety mode (SELECT and PRAGMA only)

**Example Queries:**
```sql
-- Get all tasks
SELECT * FROM tasks LIMIT 10

-- Count tasks by status
SELECT status, COUNT(*) as count FROM tasks GROUP BY status

-- Find overdue tasks
SELECT * FROM tasks WHERE dueDateTime < datetime('now')
```

### Management Actions
- **🔄 Refresh** - Updates all database information
- **🗑️ Clear Database** - Removes all data (development only, requires confirmation)

## 📋 Task Model

Each task contains the following fields:

```typescript
{
  id: number;              // Auto-generated unique identifier
  title: string;           // Required, max 200 characters
  description: string;     // Optional, max 1000 characters
  status: TaskStatus;      // TODO | IN_PROGRESS | COMPLETED
  dueDateTime: string;     // Required, ISO 8601 format
  createdAt: string;       // Auto-generated timestamp
  updatedAt: string;       // Auto-generated timestamp
}
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQL.js (in-memory for dev/test) / PostgreSQL (production)
- **Validation**: express-validator
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Development Tools
- **Concurrently**: Run multiple commands in parallel (backend + frontend)
- **TypeScript**: Type safety across the stack
- **ESLint**: Code quality and consistency

## 💾 Database Configuration

### Development & Testing (Current Setup)
- **Database:** SQL.js (in-memory)
- **Configuration:** None required ✅
- **Benefits:**
  - Zero setup - no installation needed
  - Fast testing - instant execution
  - Easy onboarding - works immediately
  - Cross-platform - identical on Windows, Mac, Linux

### Production
- **Database:** PostgreSQL
- **Configuration:** DATABASE_URL environment variable required
- **Benefits:**
  - Production-ready and battle-tested
  - ACID compliant with data persistence
  - Advanced features (transactions, replication, backups)
  - Supported by all major cloud providers

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Setup (Recommended)

Install all dependencies for both backend and frontend with a single command:

```bash
npm run install:all
```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Using Concurrently (Recommended)

The application uses **concurrently** to run multiple processes in parallel, providing a seamless development experience.

#### Start Both Servers with One Command
```bash
npm run dev
```

This single command uses **concurrently** to:
- Start the **backend API** on `http://localhost:3001` (colored blue in terminal)
- Start the **frontend dev server** on `http://localhost:3000` (colored green in terminal)
- Display output from both processes in a single terminal with color-coded labels

**Benefits:**
- ✅ One terminal, one command
- ✅ Color-coded output (blue=backend, green=frontend)
- ✅ Simultaneous startup - no waiting
- ✅ Easy monitoring of both services

### Individual Services

If you need to run services separately:

#### Start Backend Only
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

#### Start Frontend Only
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

## 🧪 Testing

### Using Concurrently for Tests

#### Run All Tests Simultaneously
```bash
npm test
```
Uses **concurrently** to run both backend and frontend tests in parallel with color-coded output.

#### Run Tests with Coverage
```bash
npm run test:coverage
```
Runs all tests with coverage reports using **concurrently**.

### Individual Test Suites

#### Backend Tests Only
```bash
npm run test:backend
# or
cd backend && npm test
```

#### Frontend Tests Only
```bash
npm run test:frontend
# or
cd frontend && npm test
```

**Test Results:**
- Backend: 51 tests passing, 82.42% coverage
- Frontend: 27 tests passing, 45.23% coverage

## 🏗️ Building for Production

### Build All with Concurrently
```bash
npm run build
```
Builds both backend and frontend applications.

### Start Production Servers
```bash
npm start
```
Uses **concurrently** to start both production servers:
- Backend production server
- Frontend preview server

### Individual Builds
```bash
npm run build:backend  # Build backend only
npm run build:frontend # Build frontend only
```

## 🔧 Additional Commands

### Lint All Code
```bash
npm run lint
```
Uses **concurrently** to lint both backend and frontend code.

### Clean All Build Artifacts
```bash
npm run clean
```
Removes all node_modules, dist, and coverage folders from both projects.

## 📋 Available Commands Reference

### Development
| Command | Description |
|---------|-------------|
| `npm run dev` | **Start both servers** using concurrently (recommended) |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |

### Testing
| Command | Description |
|---------|-------------|
| `npm test` | **Run all tests** using concurrently (recommended) |
| `npm run test:coverage` | Run all tests with coverage using concurrently |
| `npm run test:backend` | Run backend tests only |
| `npm run test:frontend` | Run frontend tests only |

### Building
| Command | Description |
|---------|-------------|
| `npm run build` | **Build both applications** (recommended) |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |

### Production
| Command | Description |
|---------|-------------|
| `npm start` | **Run both apps in production** using concurrently |
| `npm run start:backend` | Run backend production server |
| `npm run start:frontend` | Preview frontend production build |

### Maintenance
| Command | Description |
|---------|-------------|
| `npm run lint` | Lint all code using concurrently |
| `npm run clean` | Remove all build artifacts and dependencies |
| `npm run install:all` | Install all dependencies (root, backend, frontend) |

## 🔧 Troubleshooting

### PowerShell Execution Policy Error

If you encounter execution policy errors in PowerShell:

**Option 1:** Use cmd instead
```cmd
cmd /c "npm run dev"
```

**Option 2:** Temporarily bypass execution policy
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

**Option 3:** Use WSL or Git Bash

### Port Already in Use

If ports 3000 or 3001 are already in use:

1. Kill the processes using those ports:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <process_id> /F
   
   # Mac/Linux
   lsof -ti:3001 | xargs kill -9
   ```

2. Or modify the ports:
   - Backend: `backend/.env` (change `PORT=3001`)
   - Frontend: `frontend/vite.config.ts` (change `server.port`)

### Database Issues

If you encounter database errors:
```bash
# Remove the database file (development only)
rm backend/database.db

# Restart the backend
npm run dev:backend
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 1. Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the DTS challenge",
  "status": "TODO",
  "dueDateTime": "2025-12-31T23:59:59Z"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the DTS challenge",
    "status": "TODO",
    "dueDateTime": "2025-12-31T23:59:59Z",
    "createdAt": "2025-12-27T10:00:00Z",
    "updatedAt": "2025-12-27T10:00:00Z"
  }
}
```

#### 2. Get All Tasks
```http
GET /api/tasks
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the DTS challenge",
      "status": "TODO",
      "dueDateTime": "2025-12-31T23:59:59Z",
      "createdAt": "2025-12-27T10:00:00Z",
      "updatedAt": "2025-12-27T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### 3. Get Task by ID
```http
GET /api/tasks/:id
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the DTS challenge",
    "status": "TODO",
    "dueDateTime": "2025-12-31T23:59:59Z",
    "createdAt": "2025-12-27T10:00:00Z",
    "updatedAt": "2025-12-27T10:00:00Z"
  }
}
```

#### 4. Update Task
```http
PATCH /api/tasks/:id
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the DTS challenge",
    "status": "IN_PROGRESS",
    "dueDateTime": "2025-12-31T23:59:59Z",
    "createdAt": "2025-12-27T10:00:00Z",
    "updatedAt": "2025-12-27T10:15:00Z"
  }
}
```

#### 5. Delete Task
```http
DELETE /api/tasks/:id
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "error": "Task not found"
}
```

#### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## 🏗️ Architecture

### Project Structure

```
DTS/
├── backend/               # Backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── database/      # Database configuration
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # API route definitions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── validators/    # Input validation rules
│   │   ├── index.ts       # Application entry point
│   │   └── index.test.ts  # Integration tests
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/              # Frontend Application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── *.test.tsx # Component tests
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript type definitions
│   │   ├── App.tsx        # Main application component
│   │   ├── App.css        # Global styles
│   │   └── main.tsx       # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── jest.config.js
├── package.json           # Root package for concurrent scripts
└── README.md              # This file
```

## 🎯 Design Decisions

### Concurrently for Development
- **Single command** to run all services
- **Parallel execution** for faster development
- **Color-coded output** for easy monitoring
- **Unified logging** in one terminal window

### Database Choice
- **SQL.js (in-memory)** for development and testing
  - Zero setup required
  - Fast test execution
  - Perfect for CI/CD pipelines
- **PostgreSQL** for production
  - Battle-tested at scale
  - ACID compliance
  - Cloud provider support
- Easily switchable via environment variables

### Validation Strategy
- **Backend validation** using express-validator for security
- **Client-side validation** for better user experience
- **ISO 8601** datetime format for standardization

### Status Management
- Three-state status system: TODO, IN_PROGRESS, COMPLETED
- Visual indicators for quick status identification
- One-click status updates for efficiency

### Testing Approach
- **Integration tests** for backend API endpoints
- **Unit tests** for React components
- **Concurrent test execution** for faster feedback
- **70%+ coverage** threshold for quality assurance

## 🚀 Production Deployment

### Environment Variables

#### Development (.env)
```env
NODE_ENV=development
PORT=3001
# No database configuration needed - uses SQL.js in-memory
```

#### Production (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

### PostgreSQL Setup Options

#### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
choco install postgresql # Windows

# Create database
createdb dts_tasks

# Set environment
export DATABASE_URL=postgresql://localhost:5432/dts_tasks
```

#### Option 2: Cloud Database (Recommended)

**Supabase (Free Tier Available)**
1. Create account at supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Set `DATABASE_URL` environment variable

**Railway (Free Tier Available)**
1. Create account at railway.app
2. Add PostgreSQL service
3. Copy `DATABASE_URL` from service variables
4. Set environment variable

**Heroku Postgres**
```bash
heroku addons:create heroku-postgresql:mini
# DATABASE_URL is set automatically
```

#### Option 3: Docker (For Testing Production Locally)
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

### Production Deployment Steps

1. **Set Environment Variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

2. **Build Applications**
   ```bash
   npm run build
   ```

3. **Start Production Servers**
   ```bash
   npm start
   ```
   This uses **concurrently** to run both backend and frontend servers.

### Cloud Deployment Platforms

#### Heroku
```bash
# Deploy backend and frontend as separate apps
heroku create dts-backend
heroku create dts-frontend
heroku addons:create heroku-postgresql:mini -a dts-backend
git push heroku main
```

#### AWS / Azure / GCP
- Deploy backend as containerized service
- Deploy frontend to static hosting (S3, Blob Storage, Cloud Storage)
- Use managed PostgreSQL service (RDS, Azure Database, Cloud SQL)

## 🔒 Security & Best Practices

- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- Error handling without exposing sensitive information
- CORS configuration for API security
- TypeScript for type safety
- ESLint for code quality

## 📝 Future Enhancements

- User authentication and authorization
- Task filtering and sorting
- Search functionality
- Due date notifications
- Task categories/tags
- File attachments
- Activity audit log
- Pagination for large datasets
- API rate limiting
- Docker containerization
- Real-time updates via WebSockets
- Export/import functionality

## 📊 Testing & Quality Assurance

### Test Coverage
- **Backend**: 51 tests passing, 82.42% coverage
- **Frontend**: 27 tests passing, 45.23% coverage
- **Total**: 78 tests passing

### Test Plan
See [TEST_PLAN.md](TEST_PLAN.md) for comprehensive testing documentation including:
- Unit tests for all components
- Integration tests for API endpoints
- Security testing
- Performance testing
- Database adapter testing

### Running Tests Efficiently

Use **concurrently** to run all tests in parallel:
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (in separate terminals)
cd backend && npm run test:watch
cd frontend && npm run test:watch
```

## 🎓 Development Workflow

### First Time Setup
```bash
git clone <repository-url>
cd DTS
npm run install:all
```

### Daily Development
```bash
# Start all services with concurrently
npm run dev

# In another terminal, run tests
npm test
```

### Before Committing
```bash
npm test           # Run all tests
npm run lint       # Lint all code
npm run build      # Ensure builds work
```

## 📚 Additional Documentation

- [QUICKSTART.md](QUICKSTART.md) - Fast setup and common commands
- [TEST_PLAN.md](TEST_PLAN.md) - Comprehensive testing documentation
- [DATABASE.md](DATABASE.md) - Database configuration details
- [DATABASE_MANAGER.md](DATABASE_MANAGER.md) - Database Manager user guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

## 👤 Author

**autom8NG**

## 📄 License

This project is created for the HMCTS DTS Developer Technical Challenge.

---

**Built with ❤️ using React, TypeScript, Express, and Concurrently**