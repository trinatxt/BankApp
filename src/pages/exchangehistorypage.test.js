import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ExchangeHistoryPage from './exchangehistorypage';
import { useAuth } from '../components/authcontext';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'; // for better assertions

// Mock the useAuth hook
jest.mock('../components/authcontext', () => ({
  useAuth: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('ExchangeHistoryPage', () => {
  const mockUser = {
    user_id: '12345',
    email: 'test@example.com',
  };

  const mockCreditHistory = [
    {
      amount: '100',
      status: '0000',
      airline_code: 'AA',
      reference: 'REF123',
      transaction_date: '2023-01-01T00:00:00Z',
    },
    {
      amount: '200',
      status: 'In Progress',
      airline_code: 'BA',
      reference: 'REF456',
      transaction_date: '2023-02-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      creditHistory: mockCreditHistory,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ExchangeHistoryPage and displays user information', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: mockCreditHistory,
    });

    render(<ExchangeHistoryPage />);

    // Check for user ID display
    expect(screen.getByText(/User ID:/)).toBeInTheDocument();
    expect(screen.getByText(mockUser.user_id)).toBeInTheDocument();

    // Check for table headers
    expect(screen.getByText(/Transfer Date/)).toBeInTheDocument();
    expect(screen.getByText(/Amount/)).toBeInTheDocument();
    expect(screen.getByText(/Reference Number/)).toBeInTheDocument();
    expect(screen.getByText(/Status/)).toBeInTheDocument();

    // Wait for the table data to load
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    axios.post.mockRejectedValue(new Error('Failed to fetch'));

    render(<ExchangeHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch exchange history. Please try again later./)).toBeInTheDocument();
    });
  });
});
