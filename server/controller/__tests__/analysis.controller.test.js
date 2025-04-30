import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { tokenDistribution, getDailyStats, getActiveAccounts } from '../analysis.controller';
import fetchTransactions from '../../utils/api';

// Mock axios
vi.mock('axios');
vi.mock('../../utils/api');

describe('Analysis Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock request, response and next function
    req = {
      body: {
        tokenName: 'testToken',
        policyId: 'testPolicy'
      }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
  });

  describe('tokenDistribution', () => {
    const mockTokenData = {
      data: {
        supply: 1000000,
        holder: 100,
        tx: 5000,
        first_tx_time: 1000000000,
        last_tx_time: 1000000000 + (24 * 60 * 60 * 10) // 10 days later
      },
      rows: [
        {
          address: 'addr1',
          account_hash: 'hash1',
          quantity: 500000
        },
        {
          address: 'addr2',
          account_hash: 'hash2',
          quantity: 300000
        }
      ]
    };

    it('should return 400 if tokenName or policyId is missing', async () => {
      req.body = {};
      await tokenDistribution(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failure',
        message: 'Token name and policy id is requred'
      });
    });

    it('should successfully calculate token distribution metrics', async () => {
      axios.get.mockResolvedValueOnce({ data: mockTokenData });

      await tokenDistribution(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          averageSupply: 10000,
          topHolders: expect.arrayContaining([
            expect.objectContaining({
              holderAddress: 'addr1',
              holderAddressHash: 'hash1',
              quantity: 500000,
              percentage: 0.5
            })
          ]),
          dailyTransactionRate: expect.any(Number),
          transactionPerSecond: expect.any(Number),
          averageTransactionPerHolder: expect.any(Number)
        })
      });
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      axios.get.mockRejectedValueOnce(error);

      await tokenDistribution(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failure',
        message: error
      });
    });
  });

  describe('getDailyStats', () => {
    const mockTransactions = {
      rows: [
        { time: Math.floor(Date.now() / 1000) - 1800 }, // 30 minutes ago
        { time: Math.floor(Date.now() / 1000) - 3600 }, // 1 hour ago
        { time: Math.floor(Date.now() / 1000) - 7200 }  // 2 hours ago
      ]
    };

    it('should return transaction stats for the last hour', async () => {
      fetchTransactions.mockResolvedValueOnce(mockTransactions);

      await getDailyStats(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          transactionsPerMinute: expect.any(Array)
        })
      });
    });

    it('should handle errors in getDailyStats', async () => {
      const error = new Error('Failed to fetch transactions');
      fetchTransactions.mockRejectedValueOnce(error);

      await getDailyStats(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failure',
        message: error.message
      });
    });
  });

  describe('getActiveAccounts', () => {
    const mockEpochData = {
      rows: [
        { no: 1, account: 100 },
        { no: 2, account: 150 },
        { no: 3, account: 200 }
      ]
    };

    it('should return active accounts data', async () => {
      axios.get.mockResolvedValueOnce({ data: mockEpochData });

      await getActiveAccounts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.arrayContaining([
          expect.objectContaining({
            epoch: expect.any(Number),
            activeAccounts: expect.any(Number)
          })
        ])
      });
    });

    it('should handle API errors in getActiveAccounts', async () => {
      const error = new Error('API Error');
      axios.get.mockRejectedValueOnce(error);

      await getActiveAccounts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failure',
        message: 'Server Error'
      });
    });
  });
}); 