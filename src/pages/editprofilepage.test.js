import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/authcontext';
import EditProfilePage from './editprofilepage';

// Mock necessary modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../components/authcontext');
jest.mock('axios');

describe('EditProfilePage Component', () => {
  const mockNavigate = jest.fn();
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    user_id: '123',
    email: 'john.doe@example.com',
    profile_pic: 'avatar1.png',
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    jest.requireMock('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    axios.post.mockResolvedValue({ status: 200 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders EditProfilePage with all necessary elements', () => {
    render(
      <BrowserRouter>
        <EditProfilePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Choose Avatar')).toBeInTheDocument();
    expect(screen.getByText('Update Information')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('handles user input and updates state correctly', () => {
    render(
      <BrowserRouter>
        <EditProfilePage />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const usernameInput = screen.getByLabelText('Username');

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.change(usernameInput, { target: { value: 'janesmith' } });

    expect(firstNameInput.value).toBe('Jane');
    expect(lastNameInput.value).toBe('Smith');
    expect(usernameInput.value).toBe('janesmith');
  });

  test('handles form submission and updates profile', async () => {
    render(
      <BrowserRouter>
        <EditProfilePage />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const usernameInput = screen.getByLabelText('Username');
    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    const saveButton = screen.getByRole('button', { name: /Save/i });

    const toggleCurrentPasswordButton = screen.getByLabelText('toggle password visibility');
    const toggleNewPasswordButton = screen.getByLabelText('toggle new password visibility');
    const toggleConfirmPasswordButton = screen.getByLabelText('toggle confirm password visibility');

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.change(usernameInput, { target: { value: 'janesmith' } });
    fireEvent.change(currentPasswordInput, { target: { value: 'currentPassword123!' } });
    fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123!' } });

    fireEvent.click(saveButton);

    expect(currentPasswordInput).toHaveAttribute('type', 'password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click the toggle button for the current password input
    fireEvent.click(toggleCurrentPasswordButton);
    expect(currentPasswordInput).toHaveAttribute('type', 'text');

    // Click the toggle button for the new password input
    fireEvent.click(toggleNewPasswordButton);
    expect(newPasswordInput).toHaveAttribute('type', 'text');

    // Click the toggle button for the confirm password input
    fireEvent.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Click again to hide passwords
    fireEvent.click(toggleCurrentPasswordButton);
    fireEvent.click(toggleNewPasswordButton);
    fireEvent.click(toggleConfirmPasswordButton);
    expect(currentPasswordInput).toHaveAttribute('type', 'password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://weloveesc.xukaiteo.com:8001/user/auth/', {
        username: 'janesmith',
        password: 'currentPassword123!',
      });

      expect(axios.post).toHaveBeenCalledWith('http://weloveesc.xukaiteo.com:8001/user/edit_user', {
        first_name: 'Jane',
        last_name: 'Smith',
        verified: true,
        user_id: '123',
        email: 'john.doe@example.com',
        username: 'janesmith',
        profile_pic: 'avatar1.png',
        password: 'NewPassword123!',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });
});
