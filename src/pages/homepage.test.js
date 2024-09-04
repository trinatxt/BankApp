import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../components/authcontext';
import Home from './homepage';
import Navbar from '../components/Navbar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../components/authcontext');

describe('Navbar Integration Test within Home', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();
  const mockUseAuth = {
    user: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      profile_pic: 'avatar1.png', // Assuming a default avatar
    },
    logout: mockLogout,
  };

  beforeEach(() => {
    useAuth.mockReturnValue(mockUseAuth);
    jest.requireMock('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar with all necessary elements and functionality', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Navbar />
          <Home />
        </BrowserRouter>
      );
    });

    // Ensure the Navbar logo or text is displayed
    expect(screen.getByAltText('CloudBank Logo')).toBeInTheDocument(); // Assuming the logo has an alt text
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
