import React, { useState, useEffect } from 'react';
import './App.css';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { DatabaseManager } from './components/DatabaseManager';
import { Task, CreateTaskDto, TaskStatus } from './types/task.types';
import taskService from './services/taskService';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskDto) => {
    try {
      setError(null);
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowCreateForm(false); // Hide form after successful creation
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const handleUpdateTask = async (id: number, updates: { status?: TaskStatus }) => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>DTS Task Management System</h1>
        <button 
          className="btn btn-secondary db-toggle-btn"
          onClick={() => setShowDatabaseManager(!showDatabaseManager)}
        >
          {showDatabaseManager ? '📋 Tasks' : '🗄️ Database'}
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '1rem' }}>
            Dismiss
          </button>
        </div>
      )}

      {showDatabaseManager ? (
        <DatabaseManager />
      ) : (
        <>
          <div className="add-task-section">
            <button 
              className="btn btn-primary add-task-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {showCreateForm && <TaskForm onSubmit={handleCreateTask} />}

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
