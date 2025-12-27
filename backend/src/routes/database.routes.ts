import { Router } from 'express';
import databaseController from '../controllers/database.controller';

const router = Router();

// Get database schema
router.get('/schema', databaseController.getSchema.bind(databaseController));

// Get database statistics
router.get('/stats', databaseController.getStats.bind(databaseController));

// Get data from specific table
router.get('/tables/:tableName', databaseController.getTableData.bind(databaseController));

// Execute custom query (read-only)
router.post('/query', databaseController.executeQuery.bind(databaseController));

// Clear database (development only)
router.delete('/clear', databaseController.clearDatabase.bind(databaseController));

export default router;
