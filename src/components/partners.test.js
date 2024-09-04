import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Partners from './partners';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Partners Component Integration Test', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders partners and navigates on button click', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Partners />} />
          <Route path="/exchangepop1" element={<div>ExchangePop1</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the partner images and buttons are rendered
    const partners = screen.getAllByRole('img');
    expect(partners).toHaveLength(6);

    partners.forEach((img, index) => {
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', `Airline ${index + 1}`);
    });

    const buttons = screen.getAllByText('Select');
    expect(buttons).toHaveLength(6);

    // Click the button for Airline 1
    fireEvent.click(buttons[0]);

    // Check if navigate was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith('/exchangepop1', { state: { airlineCode: 'GJP' } });
  });
});
