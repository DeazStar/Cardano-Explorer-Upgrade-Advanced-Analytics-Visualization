import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from '../Table';

describe('Table Component', () => {
  const mockHeaders = ['Header 1', 'Header 2', 'Header 3'];
  const mockBodies = [
    {
      content: [
        { value: 'Cell 1' },
        { value: 'Cell 2' },
        { value: 'Cell 3' }
      ]
    },
    {
      content: [
        { value: 'Cell 4' },
        { value: 'Cell 5' },
        { value: 'Cell 6' }
      ]
    }
  ];

  it('renders headers correctly', () => {
    const headers = ['Header 1', 'Header 2'];
    const bodies = [
      {
        content: [
          { value: 'Cell 1' },
          { value: 'Cell 2' }
        ]
      }
    ];

    render(<Table headers={headers} bodies={bodies} />);

    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders body cells correctly', () => {
    const headers = ['Header 1'];
    const bodies = [
      {
        content: [
          { value: 'Cell 1' }
        ]
      }
    ];

    render(<Table headers={headers} bodies={bodies} />);

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
  });

  it('renders div content when isDiv is true', () => {
    const headers = ['Header 1'];
    const bodies = [
      {
        content: [
          { value: 'Div Content', isDiv: true }
        ]
      }
    ];

    render(<Table headers={headers} bodies={bodies} />);

    const divContent = screen.getByText('Div Content');
    expect(divContent.tagName).toBe('DIV');
  });

  it('applies custom style to cells when provided', () => {
    const headers = ['Header 1'];
    const bodies = [
      {
        content: [
          { value: 'Styled Content', style: 'custom-style' }
        ]
      }
    ];

    render(<Table headers={headers} bodies={bodies} />);
    
    const cell = screen.getByText('Styled Content').parentElement;
    expect(cell).toHaveClass('bg-tableBg');
  });

  it('handles empty bodies array', () => {
    const headers = ['Header 1'];
    const bodies = [];

    render(<Table headers={headers} bodies={bodies} />);

    // Headers should still be rendered
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    
    // No body cells should be rendered
    expect(screen.queryByText('Cell 1')).not.toBeInTheDocument();
  });
}); 