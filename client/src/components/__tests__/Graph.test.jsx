import { render, screen, fireEvent } from '@testing-library/react';
import Graph from '../Graph';
import '@testing-library/jest-dom/vitest';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock Recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="mock-line-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="mock-cartesian-grid" />,
  XAxis: () => <div data-testid="mock-x-axis" />,
  YAxis: () => <div data-testid="mock-y-axis" />,
  Tooltip: () => <div data-testid="mock-tooltip" />,
  Legend: () => <div data-testid="mock-legend" />,
  Line: () => <div data-testid="mock-line" />
}));

describe('Graph Component', () => {
  const mockData = [
    { no: 1, tx: 100, tx_amount: 1000 },
    { no: 2, tx: 200, tx_amount: 2000 },
    { no: 3, tx: 300, tx_amount: 3000 }
  ];

  beforeEach(() => {
    // Mock window.innerWidth
    global.innerWidth = 1000;
    global.dispatchEvent(new Event('resize'));
  });

  test('renders without crashing', () => {
    render(<Graph data={mockData} />);
    expect(screen.getByText('Transactions in the Past Epochs')).toBeInTheDocument();
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  test('renders all chart components', () => {
    render(<Graph data={mockData} />);
    
    expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-line')).toHaveLength(2); // Two lines for tx and tx_amount
  });

  test('renders with correct styling classes', () => {
    render(<Graph data={mockData} />);
    
    expect(screen.getByText('Transactions in the Past Epochs')).toHaveClass(
      'text-start',
      'font-semibold',
      'text-lg',
      'mb-4',
      'text-secondaryBg',
      'ml-8'
    );
    
    const container = screen.getByTestId('mock-line-chart').parentElement;
    expect(container).toHaveClass(
      'w-[95%]',
      'ml-6',
      'bg-graphBg',
      'pt-6',
      'flex',
      'flex-col',
      'justify-center'
    );
  });

  test('handles window resize', () => {
    render(<Graph data={mockData} />);
    
    // Initial width should be 85% of 1000
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    
    // Simulate window resize
    global.innerWidth = 2000;
    fireEvent(window, new Event('resize'));
    
    // The chart should still be rendered
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  test('renders with empty data', () => {
    render(<Graph data={[]} />);
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  test('renders with null data', () => {
    render(<Graph data={null} />);
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });
}); 