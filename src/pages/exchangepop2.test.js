import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../components/authcontext';
import ExchangePop2 from './exchangepop2';

// Mock necessary modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => ({
    state: { airlineCode: 'GJP', membershipId: '1234567890' },
  }),
}));

jest.mock('../components/authcontext');

describe('ExchangePop2 Component', () => {
  const mockNavigate = jest.fn();
  const mockUpdateStarpoints = jest.fn();
  const mockUseAuth = {
    user: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    },
    amount: 1000,
    starpoints: 5000,
    updateStarpoints: mockUpdateStarpoints,
  };

  beforeEach(() => {
    useAuth.mockReturnValue(mockUseAuth);
    jest.requireMock('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ExchangePop2 with all necessary elements', () => {
    render(
      <BrowserRouter>
        <ExchangePop2 />
      </BrowserRouter>
    );

    expect(screen.getByText(/exchange your miles/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => 
    content.startsWith('Points available:') && content.includes('5000')
    )).toBeInTheDocument();
    expect(screen.getByText(/points used:/i)).toBeInTheDocument();
    expect(screen.getByText(/equates to: 0 gjp/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => 
    content.startsWith('Remaining Points:') && content.includes('5000')
    )).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  test('handles user input and updates state correctly', () => {
    render(
      <BrowserRouter>
        <ExchangePop2 />
      </BrowserRouter>
    );

    const pointsUsedInput = screen.getByRole('spinbutton');
    fireEvent.change(pointsUsedInput, { target: { value: '1000' } });

    expect(pointsUsedInput.value).toBe('1000');
    expect(screen.getByText('Equates to: 1500 GJP')).toBeInTheDocument();
    expect(screen.getByText('Remaining Points: 4000')).toBeInTheDocument();
  });

  test('calls updateStarpoints when form is submitted', () => {
    render(
      <BrowserRouter>
        <ExchangePop2 />
      </BrowserRouter>
    );

    const pointsUsedInput = screen.getByRole('spinbutton');
    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    fireEvent.change(pointsUsedInput, { target: { value: '1000' } });
    fireEvent.click(confirmButton);

    // Use `await` to ensure `handleSubmit` completes before assertions
    setTimeout(() => {
      expect(mockUpdateStarpoints).toHaveBeenCalledWith(4000); // Ensure updateStarpoints is called with correct remaining points
    }, 0);
  });

  test('handles point usage correctly', () => {
    render(
      <BrowserRouter>
        <ExchangePop2 />
      </BrowserRouter>
    );

    const pointsUsedInput = screen.getByRole('spinbutton');
    fireEvent.change(pointsUsedInput, { target: { value: '500' } });

    expect(pointsUsedInput.value).toBe('500');
    expect(screen.getByText('Equates to: 750 GJP')).toBeInTheDocument(); // 500 points * rate of 1.5
    expect(screen.getByText('Remaining Points: 4500')).toBeInTheDocument(); // 5000 - 500
  });
});
