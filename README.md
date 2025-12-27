# DTS Task Management System

A full-stack task management application built for the HMCTS DTS Developer Technical Challenge. This system allows caseworkers to efficiently create, view, update, and delete tasks with comprehensive validation, error handling, and testing.

> **⚡ Quick Start:** See [QUICKSTART.md](QUICKSTART.md) for fast setup instructions and common commands.

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
- **Testing**: Comprehensive unit tests for all components

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
- **Database**: SQLite (better-sqlite3)
- **Validation**: express-validator
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Development Tools
- **Concurrently**: Run multiple commands in parallel
- **TypeScript**: Type safety across the stack
- **ESLint**: Code quality and consistency

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

### Quick Start (Recommended)

Run both backend and frontend concurrently with a single command:

```bash
npm run dev
```

This will start:
- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:3000`

### Individual Services

#### Start Backend Server Only

```bash
npm run dev:backend
```

or

```bash
cd backend
npm run dev
```

#### Start Frontend Application Only

```bash
npm run dev:frontend
```

or

```bash
cd frontend
npm run dev
```

## 🧪 Testing

### Run All Tests (Recommended)

Run tests for both backend and frontend concurrently:

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Individual Test Suites

#### Backend Tests Only

```bash
npm run test:backend
```

or

```bash
cd backend
npm test
```

#### Frontend Tests Only

```bash
npm run test:frontend
```

or

```bash
cd frontend
npm test
```

## 🏗️ Building for Production

### Build Both Applications

```bash
npm run build
```

This will build both backend and frontend applications.

### Start Production Servers

```bash
npm start
```

### Individual Builds

#### Build Backend

```bash
npm run build:backend
```

#### Build Frontend

```bash
npm run build:frontend
```

## 🔧 Additional Commands

### Lint All Code

```bash
npm run lint
```

### Clean All Build Artifacts

```bash
npm run clean
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

### Database Choice
- **SQLite** was chosen for simplicity and ease of setup
- In-memory database for tests to ensure test isolation
- Easily upgradeable to PostgreSQL or MySQL for production

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
- **70%+ coverage** threshold for quality assurance

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

## 👤 Author

**autom8NG**

## 📄 License

This project is created for the HMCTS DTS Developer Technical Challenge.