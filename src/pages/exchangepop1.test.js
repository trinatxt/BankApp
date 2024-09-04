import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../components/authcontext';
import ExchangePop1 from './ExchangePop1';
import '@testing-library/jest-dom'; // For toBeInTheDocument

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => ({
    state: { airlineCode: 'GJP' },
  }),
}));

jest.mock('../components/authcontext');

describe('ExchangePop1 Component', () => {
  const mockNavigate = jest.fn();
  const mockUseAuth = {
    user: {
      first_name: 'John',
      last_name: 'Doe',
    },
  };

  beforeEach(() => {
    useAuth.mockReturnValue(mockUseAuth);
    jest.requireMock('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form and UI elements', () => {
    render(
      <BrowserRouter>
        <ExchangePop1 />
      </BrowserRouter>
    );

    expect(screen.getByText('Exchange your miles')).toBeInTheDocument();
    expect(screen.getByText('Please link your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Membership ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Name on Card')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('handles form submission with valid data', async () => {
    render(
      <BrowserRouter>
        <ExchangePop1 />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Membership ID'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Name on Card'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/exchangepop2', { state: { membershipId: '1234567890', airlineCode: 'GJP' } });
    });
  });

  test('handles form submission with invalid card name', async () => {
    render(
      <BrowserRouter>
        <ExchangePop1 />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Membership ID'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Name on Card'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('The card name does not match the registered details.')).toBeInTheDocument();
    });
  });

  test('handles form submission with invalid membership ID', async () => {
    render(
      <BrowserRouter>
        <ExchangePop1 />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Membership ID'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Name on Card'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Membership ID does not match the required pattern.')).toBeInTheDocument();
    });
  });

  test('redirects to login if user is not authenticated', async () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <ExchangePop1 />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Membership ID'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Name on Card'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(screen.getByText('You must be logged in to validate card name.')).toBeInTheDocument();
    });
  });
});
