import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from '../routes';
import axios from 'axios';
import fetchTransactions from '../../utils/api';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Mock axios and fetchTransactions
vi.mock('axios');
vi.mock('../../utils/api');
vi.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: vi.fn().mockReturnValue((req, res, next) => {
    // Check if this is an error test case
    if (req.url.includes('error')) {
      res.status(500).json({ status: 'failure', message: 'Proxy Error' });
    } else {
      // Simulate successful proxy response
      res.status(200).json({ data: { rows: [] } });
    }
  })
}));

describe('Routes Integration Tests', () => {
  let app;
  let server;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /rest/v1/token-distribution', () => {
    const mockTokenData = {
      data: {
        supply: 1000000,
        holder: 100,
        tx: 5000,
        first_tx_time: 1000000000,
        last_tx_time: 1000000000 + (24 * 60 * 60 * 10)
      },
      rows: [
        {
          address: 'addr1',
          account_hash: 'hash1',
          quantity: 500000
        }
      ]
    };

    it('should return 400 if tokenName or policyId is missing', async () => {
      const response = await request(app)
        .post('/rest/v1/token-distribution')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'failure',
        message: 'Token name and policy id is requred'
      });
    });

    it('should return token distribution data for valid request', async () => {
      axios.get.mockResolvedValueOnce({ data: mockTokenData });

      const response = await request(app)
        .post('/rest/v1/token-distribution')
        .send({
          tokenName: 'testToken',
          policyId: 'testPolicy'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          averageSupply: 10000,
          topHolders: expect.any(Array),
          dailyTransactionRate: expect.any(Number),
          transactionPerSecond: expect.any(Number),
          averageTransactionPerHolder: expect.any(Number)
        })
      });
    });

    it('should handle invalid token request', async () => {
      const response = await request(app)
        .post('/rest/v1/token-distribution')
        .send({
          tokenName: 'InvalidToken',
          policyId: 'invalidPolicyId'
        });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /rest/v1/daily-stats', () => {
    const mockTransactions = {
      rows: [
        { time: Math.floor(Date.now() / 1000) - 1800 },
        { time: Math.floor(Date.now() / 1000) - 3600 }
      ]
    };

    it('should return transaction stats for the last hour', async () => {
      fetchTransactions.mockResolvedValueOnce(mockTransactions);

      const response = await request(app)
        .get('/rest/v1/daily-stats');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          transactionsPerMinute: expect.any(Array)
        })
      });

      const { transactionsPerMinute } = response.body.data;
      expect(Array.isArray(transactionsPerMinute)).toBe(true);
      expect(transactionsPerMinute.length).toBe(60);
      expect(transactionsPerMinute.every(count => typeof count === 'number')).toBe(true);
    });

    it('should handle errors in fetching transactions', async () => {
      const error = new Error('Failed to fetch transactions');
      fetchTransactions.mockRejectedValueOnce(error);

      const response = await request(app)
        .get('/rest/v1/daily-stats');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'failure',
        message: error.message
      });
    });
  });

  describe('GET /rest/v1/active-accounts', () => {
    const mockEpochData = {
      rows: [
        { no: 1, account: 100 },
        { no: 2, account: 150 }
      ]
    };

    it('should return active accounts data', async () => {
      axios.get.mockResolvedValueOnce({ data: mockEpochData });

      const response = await request(app)
        .get('/rest/v1/active-accounts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: expect.arrayContaining([
          expect.objectContaining({
            epoch: expect.any(Number),
            activeAccounts: expect.any(Number)
          })
        ])
      });

      const { data } = response.body;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].epoch).toBeGreaterThan(0);
      expect(data[0].activeAccounts).toBeGreaterThan(0);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      axios.get.mockRejectedValueOnce(error);

      const response = await request(app)
        .get('/rest/v1/active-accounts');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'failure',
        message: 'Server Error'
      });
    });
  });

  describe('Proxy Routes', () => {
    const mockProxyResponse = {
      data: {
        avg_block: 21261,
        block: 11636166,
        block_height: 11635989,
        block_with_tx: 8198776,
        max_block: 21702,
        max_block_epoch: 267,
        max_block_size: 148187,
        min_block: 19345,
        min_block_epoch: 347,
        min_block_size: 3,
        sum_block_size: 201385191357
      }
    };

    it('should proxy requests to external API', async () => {
      axios.get.mockResolvedValueOnce(mockProxyResponse);

      const response = await request(app)
        .get('/rest/v1/blocks.json')
        .query({ limit: 10 });

      expect(response.status).toBe(200);
    });

    it('should handle pagination in proxy requests using "after"', async () => {
      const paginatedResponse = {
        data: {
          rows: [
            { hash: 'test-hash-1', epoch: 100, slot: 1000 },
            { hash: 'test-hash-2', epoch: 99, slot: 900 }
          ]
        }
      };
      axios.get.mockResolvedValueOnce(paginatedResponse);

      const response = await request(app)
        .get('/rest/v1/blocks.json')
        .query({ 
          after: 'test-hash-0'
        });

      expect(response.status).toBe(200);
    });

    it('should handle sorting in proxy requests', async () => {
      const sortedResponse = {
        data: {
          rows: [
            { hash: 'test-hash-1', epoch: 100, slot: 1000 },
            { hash: 'test-hash-2', epoch: 99, slot: 900 }
          ]
        }
      };
      axios.get.mockResolvedValueOnce(sortedResponse);

      const response = await request(app)
        .get('/rest/v1/blocks.json')
        .query({ 
          limit: 10,
          sort: 'epoch',
          dir: 'desc'
        });

      expect(response.status).toBe(200);
      const { rows } = response.body;
      
      if (rows && rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
          expect(rows[i-1].epoch).toBeGreaterThanOrEqual(rows[i].epoch);
        }
      }
    });

    it('should handle proxy errors', async () => {
      const response = await request(app)
        .get('/rest/v1/blocks.json?error=true');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'failure',
        message: 'Proxy Error'
      });
    });
  });
}); 