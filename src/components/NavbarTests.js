// NavbarTests.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from './authcontext';
import Navbar from './Navbar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('./authcontext');

export function runNavbarTests(path) {
  describe(`Navbar Component Tests for path: ${path}`, () => {
    const mockNavigate = jest.fn();
    const mockLogout = jest.fn();

    const mockUser = {
      profile_pic: 'avatar1.png',
    };

    beforeEach(() => {
      jest.resetAllMocks();
      useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
      jest.requireMock('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
      jest.requireMock('react-router-dom').useLocation.mockReturnValue({ pathname: path });
    });

    test('renders Navbar component', () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Navbar />
        </MemoryRouter>
      );

      // Check if the logo is displayed
      expect(screen.getByAltText('CloudBank Logo')).toBeInTheDocument();
      // Check if Home and Promotions links are rendered
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Promotions')).toBeInTheDocument();
    });

    test('toggles dropdown menu on avatar click', () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Navbar />
        </MemoryRouter>
      );

      // Check if the user avatar is displayed
      const avatar = screen.getByAltText('User Avatar');
      expect(avatar).toBeInTheDocument();

      // Click the avatar to open the dropdown
      fireEvent.click(avatar);
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Exchange History')).toBeInTheDocument();

      // Click the avatar again to close the dropdown
      fireEvent.click(avatar);
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    test('calls logout and navigates to home on sign out', () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Navbar />
        </MemoryRouter>
      );

      // Click the sign out button
      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);

      // Check if logout and navigate functions are called
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navigates to login page on login button click', () => {
      // Mock useAuth to return no user
      useAuth.mockReturnValue({ user: null, logout: mockLogout });

      render(
        <MemoryRouter initialEntries={[path]}>
          <Navbar />
        </MemoryRouter>
      );

      // Click the login button
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      // Check if navigate function is called
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('applies active class to the current tab', () => {
      jest.requireMock('react-router-dom').useLocation.mockReturnValue({ pathname: path });

      render(
        <MemoryRouter initialEntries={[path]}>
          <Navbar />
        </MemoryRouter>
      );

      if (path === '/promotionpage') {
        const promotionsLink = screen.getByText('Promotions');
        expect(promotionsLink).toHaveClass('bg-6 text-white');

        const homeLink = screen.getByText('Home');
        expect(homeLink).not.toHaveClass('bg-6 text-white');
      }
    });
  });
}
