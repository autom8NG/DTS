import React, { useState } from 'react';
import { CreateTaskDto, TaskStatus } from '../types/task.types';

interface TaskFormProps {
  onSubmit: (task: CreateTaskDto) => Promise<void>;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [dueDateTime, setDueDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDateTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDateTime,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus(TaskStatus.TODO);
      setDueDateTime('');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.TODO);
    setDueDateTime('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Create New Task</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          maxLength={200}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          maxLength={1000}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDateTime">Due Date & Time *</label>
        <input
          type="datetime-local"
          id="dueDateTime"
          value={dueDateTime}
          onChange={(e) => setDueDateTime(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
