# DTS Backend API

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests with coverage
- `npm run lint` - Lint TypeScript files

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database.db
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

See main README for detailed API documentation.
