import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/task.types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: { status?: TaskStatus }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(task.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = () => {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        return 'completed';
      case TaskStatus.IN_PROGRESS:
        return 'in-progress';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    return status.replace('_', ' ');
  };

  return (
    <div className={`task-card ${getStatusClass()}`}>
      <div className="task-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
          <span className={`task-status status-${task.status}`}>
            {getStatusLabel(task.status)}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div>
          <strong>Due:</strong> {formatDateTime(task.dueDateTime)}
        </div>
        <div>
          <strong>Created:</strong> {formatDateTime(task.createdAt)}
        </div>
      </div>

      <div className="task-actions">
        {task.status !== TaskStatus.TODO && (
          <button
            onClick={() => handleStatusChange(TaskStatus.TODO)}
            className="btn-secondary"
            disabled={isUpdating || isDeleting}
          >
            Mark as To Do
          </button>
        )}
        {task.status !== TaskStatus.IN_PROGRESS && (
          <button
            onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
            className="btn-primary"
            disabled={isUpdating || isDeleting}
          >
            Mark as In Progress
          </button>
        )}
        {task.status !== TaskStatus.COMPLETED && (
          <button
            onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
            className="btn-success"
            disabled={isUpdating || isDeleting}
          >
            Mark as Completed
          </button>
        )}
        <button
          onClick={handleDelete}
          className="btn-danger"
          disabled={isUpdating || isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
