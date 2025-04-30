import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  it('renders with both left and right content', () => {
    render(
      <Card
        left="Left Content"
        right="Right Content"
      />
    );

    expect(screen.getByText('Left Content')).toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });

  it('renders with only right content when one prop is true', () => {
    render(
      <Card
        right="Right Content"
        one={true}
      />
    );

    expect(screen.queryByText('Left Content')).not.toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });

  it('applies custom leftStyle when provided', () => {
    render(
      <Card
        left="Left Content"
        right="Right Content"
        leftStyle="custom-style"
      />
    );

    const leftDiv = screen.getByText('Left Content').parentElement;
    expect(leftDiv).toHaveClass('custom-style');
  });

  it('renders with default styles when no custom style is provided', () => {
    render(
      <Card
        left="Left Content"
        right="Right Content"
      />
    );

    const leftDiv = screen.getByText('Left Content').parentElement;
    expect(leftDiv).toHaveClass('bg-tableBg');
  });
}); 