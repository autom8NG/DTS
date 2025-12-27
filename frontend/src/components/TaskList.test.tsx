import { render, screen } from '@testing-library/react';
import { TaskList } from '../components/TaskList';
import { Task, TaskStatus } from '../types/task.types';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: TaskStatus.TODO,
    dueDateTime: '2025-12-31T23:59:59Z',
    createdAt: '2025-12-27T10:00:00Z',
    updatedAt: '2025-12-27T10:00:00Z',
  },
  {
    id: 2,
    title: 'Task 2',
    description: null,
    status: TaskStatus.IN_PROGRESS,
    dueDateTime: '2025-12-30T23:59:59Z',
    createdAt: '2025-12-27T11:00:00Z',
    updatedAt: '2025-12-27T11:00:00Z',
  },
];

describe('TaskList', () => {
  it('renders empty state when no tasks are provided', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();

    render(<TaskList tasks={[]} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first task/i)).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();

    render(<TaskList tasks={mockTasks} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('renders correct number of task items', () => {
    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();

    const { container } = render(
      <TaskList tasks={mockTasks} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    const taskCards = container.querySelectorAll('.task-card');
    expect(taskCards).toHaveLength(2);
  });
});
