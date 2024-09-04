import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './loginpage';
import '@testing-library/jest-dom';



jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: {} }),
}));

jest.mock('../components/authcontext', () => ({
  useAuth: () => ({ authenticate: jest.fn() }),
}));

describe('LoginPage', () => {
  test('renders login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Tugharia Bank Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('shows error message when username is missing', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'ShutUp123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('Please enter a username.')).toBeInTheDocument();
  });

  test('shows error message when password is missing', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'ryaready4it' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('Please enter a password.')).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const toggleIcon = screen.getByRole('button', { name: /toggle password visibility/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
