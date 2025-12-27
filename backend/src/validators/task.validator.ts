import { body, param } from 'express-validator';
import { TaskStatus } from '../types/task.types';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`),
  
  body('dueDateTime')
    .notEmpty()
    .withMessage('Due date and time is required')
    .isISO8601()
    .withMessage('Due date and time must be a valid ISO 8601 date'),
];

export const updateTaskValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`),
  
  body('dueDateTime')
    .optional()
    .isISO8601()
    .withMessage('Due date and time must be a valid ISO 8601 date'),
];

export const taskIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
];
