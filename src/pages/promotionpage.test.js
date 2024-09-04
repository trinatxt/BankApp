import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import PromotionPage from './promotionpage';

const mock = new MockAdapter(axios);

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('PromotionPage', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders loading state initially', () => {
    renderWithProviders(<PromotionPage />);
    expect(screen.getByText(/Loading promotions.../)).toBeInTheDocument();
  });

  test('fetches and displays promotions', async () => {
    const promotions = [
      { name: 'Promo 1', description: 'Description for Promo 1' },
      { name: 'Promo 2', description: 'Description for Promo 2' },
    ];

    mock.onPost('http://weloveesc.xukaiteo.com:8001/tc/promotions/get').reply(200, promotions);

    renderWithProviders(<PromotionPage />);

    await waitFor(() => {
      expect(screen.getByText('Promo 1')).toBeInTheDocument();
      expect(screen.getByText('Description for Promo 1')).toBeInTheDocument();
      expect(screen.getByText('Promo 2')).toBeInTheDocument();
      expect(screen.getByText('Description for Promo 2')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    mock.onPost('http://weloveesc.xukaiteo.com:8001/tc/promotions/get').reply(500);

    renderWithProviders(<PromotionPage />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching promotions.')).toBeInTheDocument();
    });
  });
});
