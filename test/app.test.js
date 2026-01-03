const request = require('supertest');
const app = require('../app');

// Mock Redis Service
jest.mock('../src/services/redisService', () => ({
  getUser: jest.fn(),
  saveUser: jest.fn(),
  getUrl: jest.fn(),
  saveUrl: jest.fn(),
  getUserUrls: jest.fn(),
  trackClick: jest.fn(),
  getStats: jest.fn(),
}));

const redisService = require('../src/services/redisService');

describe('URL Shortener API', () => {
  let token;

  beforeAll(async () => {
    // Mock login to get a token
    const jwt = require('jsonwebtoken');
    token = jwt.sign({ username: 'testuser' }, 'super-secret-key-123');
  });

  it('GET /health returns OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('OK');
  });

  it('POST /api/shorten creates code', async () => {
    redisService.getUrl.mockResolvedValue(null);
    redisService.saveUrl.mockResolvedValue();

    const response = await request(app)
      .post('/api/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: 'https://google.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('code');
  });

  it('GET /:code redirects', async () => {
    redisService.getUrl.mockResolvedValue({ originalUrl: 'https://google.com' });
    
    const response = await request(app).get('/abc123');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('https://google.com');
  });

  it('GET / serves frontend', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });
});
