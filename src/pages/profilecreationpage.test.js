import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfileCreationPage from './profilecreationpage';
import { AuthProvider } from '../components/authcontext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useAuth hook
jest.mock('../components/authcontext', () => ({
  useAuth: () => ({
    signUp: jest.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

test('renders form elements', () => {
  render(
    <Router>
      <AuthProvider>
        <ProfileCreationPage />
      </AuthProvider>
    </Router>
  );

  // Check for form fields
  expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

  // Check for the heading
  expect(screen.getByRole('heading', { name: 'Create Profile' })).toBeInTheDocument();

  // Check for the submit button
  expect(screen.getByRole('button', { name: 'Create Profile' })).toBeInTheDocument();
});

test('toggles password visibility', () => {
  render(
    <Router>
      <AuthProvider>
        <ProfileCreationPage />
      </AuthProvider>
    </Router>
  );

  const passwordInput = screen.getByPlaceholderText('Password');
  const verifyPasswordInput = screen.getByPlaceholderText('Verify Password');
  const togglePasswordButton = screen.getByLabelText('toggle password visibility');
  const toggleVerifyPasswordButton = screen.getByLabelText('toggle verify password visibility');

  // Initially, password inputs should be of type 'password'
  expect(passwordInput).toHaveAttribute('type', 'password');
  expect(verifyPasswordInput).toHaveAttribute('type', 'password');

  // Click the toggle button for the password input
  fireEvent.click(togglePasswordButton);
  expect(passwordInput).toHaveAttribute('type', 'text');

  // Click the toggle button for the verify password input
  fireEvent.click(toggleVerifyPasswordButton);
  expect(verifyPasswordInput).toHaveAttribute('type', 'text');

  // Click again to hide passwords
  fireEvent.click(togglePasswordButton);
  fireEvent.click(toggleVerifyPasswordButton);
  expect(passwordInput).toHaveAttribute('type', 'password');
  expect(verifyPasswordInput).toHaveAttribute('type', 'password');
});
