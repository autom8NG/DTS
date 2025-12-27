# Quick Start Guide

## 🚀 Fast Setup (3 Steps)

### 1. Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently)
- Backend (Express, SQLite, TypeScript, etc.)
- Frontend (React, Vite, TypeScript, etc.)

### 2. Run the Application

```bash
npm run dev
```

This starts both backend and frontend concurrently:
- Backend API: http://localhost:3001
- Frontend UI: http://localhost:3000

### 3. Test the Application

```bash
npm test
```

This runs all tests for both backend and frontend.

## 📋 Available Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both backend and frontend in development mode |
| `npm run dev:backend` | Run only backend |
| `npm run dev:frontend` | Run only frontend |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests concurrently |
| `npm run test:coverage` | Run all tests with coverage reports |
| `npm run test:backend` | Run backend tests only |
| `npm run test:frontend` | Run frontend tests only |

### Building

| Command | Description |
|---------|-------------|
| `npm run build` | Build both backend and frontend |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |

### Production

| Command | Description |
|---------|-------------|
| `npm start` | Run both applications in production mode |
| `npm run start:backend` | Run backend production server |
| `npm run start:frontend` | Preview frontend production build |

### Maintenance

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint all code |
| `npm run clean` | Remove all node_modules, dist, and coverage folders |

## 🎯 Typical Workflow

### First Time Setup

```bash
# Clone the repository
git clone <repository-url>
cd DTS

# Install all dependencies
npm run install:all
```

### Daily Development

```bash
# Start development servers
npm run dev

# In another terminal, run tests in watch mode
cd backend && npm run test:watch
# or
cd frontend && npm run test:watch
```

### Before Committing

```bash
# Run all tests
npm test

# Lint code
npm run lint

# Build to ensure no build errors
npm run build
```

## 🔧 Troubleshooting

### PowerShell Execution Policy Error

If you encounter execution policy errors in PowerShell, use one of these solutions:

**Option 1:** Use cmd instead:
```cmd
cmd /c "npm run dev"
```

**Option 2:** Temporarily bypass execution policy:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

**Option 3:** Use WSL or Git Bash

### Port Already in Use

If ports 3000 or 3001 are already in use:

1. Kill the processes using those ports
2. Or modify the ports in:
   - Backend: `backend/.env` (change `PORT=3001`)
   - Frontend: `frontend/vite.config.ts` (change `server.port`)

### Database Issues

If you encounter database errors:

```bash
# Remove the database file
rm backend/database.db

# Restart the backend
npm run dev:backend
```

## 📚 Next Steps

- Read the [main README](README.md) for detailed documentation
- Check [API documentation](README.md#-api-documentation) for endpoint details
- Review [backend README](backend/README.md) for backend-specific info
- Review [frontend README](frontend/README.md) for frontend-specific info

## 💡 Tips

1. **Color-coded output**: Backend logs are in blue, frontend logs are in green
2. **Concurrent output**: Both applications run side-by-side in the same terminal
3. **Individual control**: Use separate terminals if you need independent control
4. **Hot reload**: Both backend and frontend support hot reload in development mode
