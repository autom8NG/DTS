import React from 'react';
import { Task, TaskStatus } from '../types/task.types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, updates: { status?: TaskStatus }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No tasks yet</h2>
        <p>Create your first task using the form above</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
