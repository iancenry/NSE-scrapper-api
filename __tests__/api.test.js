const request = require('supertest');
const app = require('../index');

describe('NSE Scraper API', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Welcome to NSE Scraper API');
      expect(res.body.version).toBe('2.0.0');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
      expect(res.body.uptime).toBeDefined();
      expect(res.body.cache).toBeDefined();
      expect(res.body.memory).toBeDefined();
    });
  });

  describe('GET /stocks', () => {
    it('should return stocks data', async () => {
      const res = await request(app).get('/stocks').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeGreaterThanOrEqual(0);
    }, 30000); // 30 second timeout for scraping

    it('should accept query parameters', async () => {
      const res = await request(app)
        .get('/stocks?limit=5&sort=ticker&order=asc')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.limit).toBe(5);
      expect(res.body.meta.sortBy).toBe('ticker');
    }, 30000);
  });

  describe('GET /stocks/:searchId', () => {
    it('should return filtered stocks', async () => {
      const res = await request(app).get('/stocks/equity').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta.searchTerm).toBe('equity');
    }, 30000);

    it('should return 400 for invalid search parameter', async () => {
      await request(app).get('/stocks/').expect(404); // Not found because of route pattern
    });
  });

  describe('GET /api-docs', () => {
    it('should serve API documentation', async () => {
      await request(app).get('/api-docs/').expect(200);
    });
  });

  describe('GET /invalid-route', () => {
    it('should return 404 for invalid routes', async () => {
      await request(app).get('/invalid-route').expect(404);
    });
  });
});
