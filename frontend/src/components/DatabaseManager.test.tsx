import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the database service BEFORE importing
jest.mock('../services/databaseService', () => ({
  __esModule: true,
  default: {
    getSchema: jest.fn(),
    getStats: jest.fn(),
    getTableData: jest.fn(),
    executeQuery: jest.fn(),
    clearDatabase: jest.fn(),
  },
}));

import { DatabaseManager } from './DatabaseManager';
import databaseService from '../services/databaseService';

const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;

describe('DatabaseManager', () => {
  const mockSchema = {
    tables: ['tasks'],
    schema: {
      tasks: {
        columns: [
          { cid: 0, name: 'id', type: 'INTEGER', notnull: 0, dflt_value: null, pk: 1 },
          { cid: 1, name: 'title', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
        ],
        indexes: [],
      },
    },
  };

  const mockStats = {
    tableCount: 1,
    tables: {
      tasks: { rowCount: 5 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabaseService.getSchema.mockResolvedValue(mockSchema);
    mockDatabaseService.getStats.mockResolvedValue(mockStats);
  });

  describe('Component Rendering', () => {
    it('renders all tabs correctly', async () => {
      render(<DatabaseManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Statistics/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Schema/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Data Browser/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Query Console/i })).toBeInTheDocument();
      });
    });

    it('loads initial data on mount', async () => {
      render(<DatabaseManager />);

      await waitFor(() => {
        expect(mockDatabaseService.getStats).toHaveBeenCalled();
        expect(mockDatabaseService.getSchema).toHaveBeenCalled();
      });
    });
  });

  describe('Statistics Tab', () => {
    it('displays database statistics', async () => {
      render(<DatabaseManager />);

      await waitFor(() => {
        expect(screen.getByText(/Database Statistics/i)).toBeInTheDocument();
      });
    });
  });

  describe('Schema Tab', () => {
    it('switches to schema tab when clicked', async () => {
      render(<DatabaseManager />);

      await waitFor(() => {
        const schemaButton = screen.getByText(/Schema/i);
        fireEvent.click(schemaButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Database Schema/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when loading fails', async () => {
      mockDatabaseService.getStats.mockRejectedValue(new Error('Network error'));

      render(<DatabaseManager />);

      await waitFor(() => {
        const errorText = screen.queryByText(/failed/i) || screen.queryByText(/error/i);
        expect(errorText).toBeTruthy();
      });
    });
  });
});
