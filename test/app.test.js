const request = require('supertest');
const app = require('../app');

// Mock Redis Service
jest.mock('../src/services/redisService', () => ({
  getTodos: jest.fn().mockResolvedValue([{ id: '1', text: 'Test Todo' }]),
  addTodo: jest.fn().mockResolvedValue({ id: '2', text: 'New Todo' }),
  deleteTodo: jest.fn().mockResolvedValue([]),
}));

describe('Todo API', () => {
  it('GET /api/todos returns list', async () => {
    const response = await request(app).get('/api/todos');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].text).toBe('Test Todo');
  });

  it('POST /api/todos creates todo', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ text: 'New Todo' });
    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe('New Todo');
  });

  it('DELETE /api/todos/:id deletes todo', async () => {
    const response = await request(app).delete('/api/todos/1');
    expect(response.statusCode).toBe(204);
  });
});

describe('Frontend Serving', () => {
  it('GET / serves index.html', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });
});
