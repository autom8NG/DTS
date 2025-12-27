export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDateTime: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDateTime: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDateTime?: string;
}
