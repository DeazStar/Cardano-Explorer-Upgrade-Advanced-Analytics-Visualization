import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Accounts from '../Account';
import '@testing-library/jest-dom/vitest';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock data that matches the actual API response structure
const mockAccountData = {
  data: {
    account: 1000,
    account_with_amount: 800,
    delegator: 500,
    delegator_with_stake: 400,
    shelley_amount: 1000000,
    stake: 900000,
    account_types: {
      'Reward Account': { qty: 100, stake: 500000 },
      'Enterprise Account': { qty: 200, stake: 400000 }
    }
  },
  rows: [
    {
      hash: 'abc123def456',
      bech32: 'addr1qxy2k...',
      balance: 1000,
      token: 5,
      total_reward_amount: 100,
      first_tx_hash: 'tx1abc123',
      first_tx_time: 1634567890,
      last_tx_hash: 'tx2def456',
      last_tx_time: 1634567891,
      tx: 10,
      pool_name: 'Test Pool',
      pool_ticker: 'TEST'
    }
  ],
  cursor: {
    after: 'cursor123',
    next: true
  }
};

describe('Accounts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockAccountData });
  });

  const renderAccounts = () => {
    return render(
      <BrowserRouter>
        <Accounts />
      </BrowserRouter>
    );
  };

  test('renders error state when API call fails', async () => {
    const errorMessage = 'API Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    renderAccounts();
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('renders account statistics cards after successful API call', async () => {
    renderAccounts();
    
    await waitFor(() => {
      expect(screen.getByText('TOTAL ACCOUNTS')).toBeInTheDocument();
      expect(screen.getByText('DELEGATORS')).toBeInTheDocument();
      expect(screen.getByText('SHELLEY AMOUNT')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('renders account types table with correct data', async () => {
    renderAccounts();
    
    await waitFor(() => {
      expect(screen.getByText('Account Types')).toBeInTheDocument();
      expect(screen.getByText('Reward Account')).toBeInTheDocument();
      expect(screen.getByText('Enterprise Account')).toBeInTheDocument();
    }, { timeout: 100000 });
  });

  test('handles pagination correctly', async () => {
    renderAccounts();
    
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    const nextButton = screen.getByText('Next »');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('formats hash correctly', async () => {
    renderAccounts();
    
    await waitFor(() => {
      const formattedHash = screen.getByText('abc123...def456');
      expect(formattedHash).toBeInTheDocument();
    }, { timeout: 10000 });
  });
}); 