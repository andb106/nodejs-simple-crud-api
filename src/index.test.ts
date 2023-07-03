import { server } from './index';

import request from 'supertest';

const BASE_URL = '/api/users';

describe('simple tests for GET endpoint', () => {
  afterAll(() => {
    server.close();
  });

  test('should return empty array', async () => {
    const response = await request(server).get(BASE_URL);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should return status code 404 for wrong route', async () => {
    const response = await request(server).get(BASE_URL + '123');
    expect(response.statusCode).toBe(404);
  });
});
