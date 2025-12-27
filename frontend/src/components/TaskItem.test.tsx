import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '../components/TaskItem';
import { Task, TaskStatus } from '../types/task.types';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TODO,
  dueDateTime: '2025-12-31T23:59:59Z',
  createdAt: '2025-12-27T10:00:00Z',
  updatedAt: '2025-12-27T10:00:00Z',
};

describe('TaskItem', () => {
  it('renders task information correctly', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <TaskItem task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/TODO/i)).toBeInTheDocument();
  });

  it('calls onUpdate when status button is clicked', () => {
    const mockOnUpdate = jest.fn().mockResolvedValue(undefined);
    const mockOnDelete = jest.fn();

    render(
      <TaskItem task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    fireEvent.click(screen.getByText(/mark as in progress/i));

    expect(mockOnUpdate).toHaveBeenCalledWith(1, { status: TaskStatus.IN_PROGRESS });
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn().mockResolvedValue(undefined);
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(
      <TaskItem task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    fireEvent.click(screen.getByText(/delete/i));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('does not call onDelete when deletion is cancelled', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();
    
    window.confirm = jest.fn(() => false);

    render(
      <TaskItem task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    fireEvent.click(screen.getByText(/delete/i));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('displays correct status badge for completed task', () => {
    const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <TaskItem task={completedTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    expect(screen.getByText(/COMPLETED/i)).toBeInTheDocument();
  });
});
