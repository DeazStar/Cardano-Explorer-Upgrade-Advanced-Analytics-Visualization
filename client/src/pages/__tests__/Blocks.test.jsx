import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Blocks from '../Blocks';
import '@testing-library/jest-dom/vitest';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock components
vi.mock('../components/NavBar', () => ({
  default: () => <div data-testid="mock-navbar">Mock NavBar</div>
}));

vi.mock('../components/Menu', () => ({
  default: () => <div data-testid="mock-menu">Mock Menu</div>
}));

vi.mock('../components/Card', () => ({
  default: ({ left, right }) => (
    <div data-testid="mock-card">
      <div data-testid="mock-card-left">{left}</div>
      <div data-testid="mock-card-right">{right}</div>
    </div>
  )
}));

vi.mock('../components/Table', () => ({
  default: ({ headers, bodies }) => (
    <div data-testid="mock-table">
      <div data-testid="mock-table-headers">{headers.join(', ')}</div>
      <div data-testid="mock-table-bodies">
        {bodies.map((body, index) => (
          <div key={index}>{JSON.stringify(body.content)}</div>
        ))}
      </div>
    </div>
  )
}));

vi.mock('../components/BarChart', () => ({
  default: ({ chartData }) => (
    <div data-testid="mock-bar-chart">
      {JSON.stringify(chartData)}
    </div>
  )
}));

// Mock data
const mockBlockData = {
  data: {
    block_height: 1000,
    block_with_tx: 800,
    avg_block: 100,
    min_block_epoch: 347,
    max_block_epoch: 267,
    sum_block_size: 1000000,
    min_block_size: 500000,
    max_block_size: 1500000
  },
  rows: [
    {
      hash: 'abc123def456',
      no: 1000,
      time: 1634567890,
      tx: 10,
      size: 1000,
      pool_name: 'Test Pool',
      slot_no: 100,
      epoch_slot_no: 50,
      tx_amount: 1000,
      tx_out_sum: 900,
      tx_fee: 100,
      epoch_no: 1
    }
  ],
  cursor: {
    after: 'cursor123',
    next: true
  }
};

describe('Blocks Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockBlockData });
  });

  const renderBlocks = () => {
    return render(
      <BrowserRouter>
        <Blocks />
      </BrowserRouter>
    );
  };

  test('renders error state when API call fails', async () => {
    const errorMessage = 'API Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    renderBlocks();
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('handles pagination correctly', async () => {
    renderBlocks();
    
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    const nextButton = screen.getByText('Next »');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('formats dates correctly', async () => {
    renderBlocks();
    
    await waitFor(() => {
      const formattedDate = screen.getByText(/2021/);
      expect(formattedDate).toBeInTheDocument();
    }, { timeout: 10000 });
  });
}); 