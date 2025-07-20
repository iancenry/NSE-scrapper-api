const request = require('supertest');
const app = require('../index');

describe('NSE Scraper API', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Welcome to NSE Scraper API');
      expect(res.body.version).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('GET /stocks', () => {
    it('should return all stocks', async () => {
      const res = await request(app).get('/stocks').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeDefined();
    });

    it('should respect limit parameter', async () => {
      const res = await request(app).get('/stocks?limit=5').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.limit).toBe(5);
    });

    it('should validate limit parameter', async () => {
      const res = await request(app).get('/stocks?limit=-1').expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  describe('GET /stocks/:searchId', () => {
    it('should search for stocks by valid ticker', async () => {
      const res = await request(app).get('/stocks/EQTY').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.searchTerm).toBe('EQTY');
    });

    it('should return 404 for non-existent stock', async () => {
      const res = await request(app)
        .get('/stocks/NONEXISTENT123456')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No stocks found');
    });

    it('should validate search parameter format', async () => {
      const res = await request(app).get('/stocks/@invalid!').expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for invalid routes', async () => {
      const res = await request(app).get('/nonexistent').expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});
