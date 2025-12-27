# DTS Frontend Application

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

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests with coverage
- `npm run lint` - Lint TypeScript files

## Environment Variables

The frontend uses Vite's environment variables. Create a `.env` file if needed:

```env
VITE_API_URL=http://localhost:3001/api
```

## Features

- Create tasks with title, description, status, and due date
- View all tasks in an organized list
- Update task status (TODO → IN_PROGRESS → COMPLETED)
- Delete tasks with confirmation
- Responsive design with visual status indicators
- Real-time error handling and user feedback

## Components

- **TaskForm** - Form for creating new tasks
- **TaskList** - Container for displaying all tasks
- **TaskItem** - Individual task card with actions
- **App** - Main application component with state management

See main README for detailed documentation.
