import { Router } from 'express';
import taskController from '../controllers/task.controller.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
} from '../validators/task.validator.js';

const router = Router();

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post('/', createTaskValidation, taskController.createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public
 */
router.get('/', taskController.getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Public
 */
router.get('/:id', taskIdValidation, taskController.getTaskById);

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Update task status or other fields
 * @access  Public
 */
router.patch('/:id', updateTaskValidation, taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Public
 */
router.delete('/:id', taskIdValidation, taskController.deleteTask);

export default router;
