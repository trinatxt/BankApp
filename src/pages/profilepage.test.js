import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../components/authcontext'; // Adjust import paths as needed
import ProfilePage from './profilepage';
import { useNavigate } from 'react-router-dom';

const mock = new MockAdapter(axios);

jest.mock('../components/authcontext', () => ({
  ...jest.requireActual('../components/authcontext'),
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockUser = {
  user: { profile_pic: 'avatar1.png', first_name: 'John', last_name: 'Doe', username: 'johndoe' },
  email: 'john.doe@example.com',
  user_id: '12345',
  starpoints: 100,
  setUser: jest.fn(),
  logout: jest.fn(),
};

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <AuthProvider value={providerProps}>
        {ui}
      </AuthProvider>
    </BrowserRouter>,
    renderOptions
  );
};


describe('ProfilePage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue(mockUser);
    useNavigate.mockReturnValue(mockNavigate);
    mock.reset();
  });

  test('renders ProfilePage with user data', async () => {
    mock.onPost('http://weloveesc.xukaiteo.com:8001/user/get_user').reply(200, mockUser.user);
    mock.onPost('http://weloveesc.xukaiteo.com:8001/card/get_cards').reply(200, []);
    mock.onPost('http://weloveesc.xukaiteo.com:8001/transactions/get_summary').reply(200, {});

    renderWithProviders(<ProfilePage />, { providerProps: mockUser });

    expect(screen.getByText(/Profile/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();

    const profileContainer = screen.getByText(/John Doe/).closest('div');
    expect(within(profileContainer).getByText(/Tugharia points:/)).toBeInTheDocument();
    expect(within(profileContainer).getByText('100')).toBeInTheDocument();
  });

  test('fetches and displays user cards', async () => {
    const cards = [
      { card_name: 'Card 1' },
      { card_name: 'Card 2' },
    ];

    mock.onPost('http://weloveesc.xukaiteo.com:8001/card/get_cards').reply(200, cards);
    mock.onPost('http://weloveesc.xukaiteo.com:8001/transactions/get_summary').reply(200, {});

    renderWithProviders(<ProfilePage />, { providerProps: mockUser });

    await waitFor(() => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
  });

  test('handles delete account', async () => {
    window.confirm = jest.fn(() => true);
    mock.onPost('http://weloveesc.xukaiteo.com:8001/user/delete_user').reply(200);

    renderWithProviders(<ProfilePage />, { providerProps: mockUser });

    fireEvent.click(screen.getByText(/Delete Account/));

    await waitFor(() => {
      expect(mockUser.logout).toHaveBeenCalled();
    });
  });

  test('navigates to Edit Profile Page on edit icon click', async () => {
    mock.onPost('http://weloveesc.xukaiteo.com:8001/user/get_user').reply(200, mockUser.user);
    mock.onPost('http://weloveesc.xukaiteo.com:8001/card/get_cards').reply(200, []);
    mock.onPost('http://weloveesc.xukaiteo.com:8001/transactions/get_summary').reply(200, {});

    renderWithProviders(<ProfilePage />, { providerProps: mockUser });

    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/editprofilepage');
    });
  });

  
});
