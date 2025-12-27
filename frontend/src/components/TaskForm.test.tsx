import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../components/TaskForm';
import { TaskStatus } from '../types/task.types';

describe('TaskForm', () => {
  it('renders form fields correctly', () => {
    const mockOnSubmit = jest.fn();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByText(/create task/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-12-31T23:59' },
    });

    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        dueDateTime: '2025-12-31T23:59',
      });
    });
  });

  it('resets form after successful submission', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-12-31T23:59' },
    });

    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(titleInput.value).toBe('');
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText(/cancel/i));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
