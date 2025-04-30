import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProxyMiddleware } from 'http-proxy-middleware';
import serverProxy from '../proxyServer.controller';
import BASEURL from '../../constants';

// Mock http-proxy-middleware
vi.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: vi.fn()
}));

describe('Proxy Server Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock request, response and next function
    req = {
      params: { 0: 'blocks' },
      query: {
        page: '1',
        limit: '10'
      }
    };
    res = {};
    next = vi.fn();

    // Mock the proxy middleware function
    createProxyMiddleware.mockReturnValue(vi.fn());
  });

  it('should create proxy middleware with correct configuration', async () => {
    await serverProxy(req, res, next);

    expect(createProxyMiddleware).toHaveBeenCalledWith({
      target: BASEURL,
      changeOrigin: true,
      logger: console,
      pathRewrite: expect.any(Function)
    });
  });

  it('should handle path rewriting correctly', async () => {
    await serverProxy(req, res, next);

    // Get the pathRewrite function from the proxy configuration
    const pathRewriteFunction = createProxyMiddleware.mock.calls[0][0].pathRewrite;
    
    // Test the pathRewrite function
    const rewrittenPath = pathRewriteFunction('/api/blocks', req);
    expect(rewrittenPath).toBe('blocks?page=1&limit=10&');
  });

  it('should handle empty query parameters', async () => {
    req.query = {};
    await serverProxy(req, res, next);

    const pathRewriteFunction = createProxyMiddleware.mock.calls[0][0].pathRewrite;
    const rewrittenPath = pathRewriteFunction('/api/blocks', req);
    expect(rewrittenPath).toBe('blocks?');
  });

  it('should handle error cases', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    createProxyMiddleware.mockImplementation(() => {
      throw new Error('Proxy creation failed');
    });

    await serverProxy(req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith('Error: Error: Proxy creation failed');
    consoleSpy.mockRestore();
  });

  it('should call the proxy middleware with request, response and next', async () => {
    const mockProxyMiddleware = vi.fn();
    createProxyMiddleware.mockReturnValue(mockProxyMiddleware);

    await serverProxy(req, res, next);

    expect(mockProxyMiddleware).toHaveBeenCalledWith(req, res, next);
  });
}); 