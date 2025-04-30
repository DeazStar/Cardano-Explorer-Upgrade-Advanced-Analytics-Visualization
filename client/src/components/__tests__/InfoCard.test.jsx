import { render, screen } from '@testing-library/react';
import InfoCard from '../InfoCard';
import '@testing-library/jest-dom/vitest';
import { describe, test, expect } from 'vitest';

describe('InfoCard Component', () => {
  const mockProps = {
    image: 'test-image.png',
    title: 'Test Title',
    body: 'Test Body',
    width: 80
  };

  test('renders without crashing', () => {
    render(<InfoCard {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });

  test('renders with correct image', () => {
    render(<InfoCard {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');
    expect(image).toHaveAttribute('width', '80');
  });

  test('renders with default width when not provided', () => {
    const propsWithoutWidth = {
      image: 'test-image.png',
      title: 'Test Title',
      body: 'Test Body'
    };
    render(<InfoCard {...propsWithoutWidth} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '60');
  });

  test('renders with correct styling classes', () => {
    render(<InfoCard {...mockProps} />);
    
    // Check container classes
    const container = screen.getByText('Test Title').closest('.mt-4');
    expect(container).toBeInTheDocument();
    
    // Check image container classes
    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass(
      'bg-cardBg',
      'p-4',
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'h-24'
    );
    
    // Check text container classes
    const textContainer = screen.getByText('Test Title').parentElement;
    expect(textContainer).toHaveClass(
      'bg-secondaryBg',
      'px-12',
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'leading-6'
    );
    
    // Check title text classes
    expect(screen.getByText('Test Title')).toHaveClass(
      'font-semibold',
      'text-white',
      'text-lg',
      'md:text-base',
      'sm:text-sm'
    );
    
    // Check body text classes
    expect(screen.getByText('Test Body')).toHaveClass(
      'font-bold',
      'text-white',
      'text-lg',
      'md:text-base',
      'sm:text-sm'
    );
  });

  test('renders with empty props', () => {
    render(<InfoCard image="" title="" body="" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders with long text content', () => {
    const longProps = {
      image: 'test-image.png',
      title: 'This is a very long title that should wrap properly',
      body: 'This is a very long body text that should also wrap properly'
    };
    render(<InfoCard {...longProps} />);
    expect(screen.getByText(longProps.title)).toBeInTheDocument();
    expect(screen.getByText(longProps.body)).toBeInTheDocument();
  });
}); 