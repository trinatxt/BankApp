import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './hero';
import homepagepic5 from '../assets/homepagepic5.jpg';

// Mock the image import
jest.mock('../assets/homepagepic5.jpg', () => 'homepagepic5.jpg');

describe('Hero Component Integration Test', () => {
  test('renders Hero component with image and overlay div', () => {
    render(<Hero />);

    // Check if the image is rendered
    const image = screen.getByAltText('homepagepic5');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'homepagepic5.jpg');
    expect(image).toHaveClass('absolute top-0 left-0 w-full h-full object-cover');

    // Check if the overlay div is rendered
    const overlayDiv = screen.getByTestId('overlay'); // Use data-testid to find the div
    expect(overlayDiv).toBeInTheDocument();
    expect(overlayDiv).toHaveClass('absolute top-0 left-0 w-full h-full flex flex-col justify-center text-white');
  });
});
