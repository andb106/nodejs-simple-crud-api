import { server } from './index';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

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

describe('Scenario-1, test all methods with correct requests', () => {
  afterAll(() => {
    server.close();
  });

  const userData = {
    username: 'A',
    age: 10,
    hobbies: ['hobby1', 'hobby2'],
  };

  test('post method should return status code 201 and newly created record', async () => {
    const response = await request(server).post(BASE_URL).send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toEqual(userData.username);
    expect(response.body.age).toEqual(userData.age);
    expect(response.body.hobbies).toEqual(userData.hobbies);
  });

  test('get method should return 1 user', async () => {
    const response = await request(server).get(BASE_URL);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test('get method should return user by id with correct data', async () => {
    const responseToAllUsers = await request(server).get(BASE_URL);
    const userId = responseToAllUsers.body[0].id;
    const responseToUser = await request(server).get(BASE_URL + `/${userId}`);
    expect(responseToUser.statusCode).toBe(200);
    expect(responseToUser.body.username).toEqual(userData.username);
    expect(responseToUser.body.age).toEqual(userData.age);
    expect(responseToUser.body.hobbies).toEqual(userData.hobbies);
  });

  test('put method should return status code 201 and updated record', async () => {
    const responseToAllUsers = await request(server).get(BASE_URL);
    const userId = responseToAllUsers.body[0].id;
    const newUserData = {
      username: 'B',
      age: 20,
      hobbies: ['hobby10', 'hobby20'],
    };
    const responseToUser = await request(server)
      .put(BASE_URL + `/${userId}`)
      .send(newUserData);
    expect(responseToUser.statusCode).toBe(200);
    expect(responseToUser.body.username).toEqual(newUserData.username);
    expect(responseToUser.body.age).toEqual(newUserData.age);
    expect(responseToUser.body.hobbies).toEqual(newUserData.hobbies);
    expect(responseToUser.body.id).toEqual(userId);
  });

  test('delete method should delete user and return status code 204', async () => {
    const responseToAllUsers = await request(server).get(BASE_URL);
    const userId = responseToAllUsers.body[0].id;
    const responseToDelete = await request(server).delete(
      BASE_URL + `/${userId}`,
    );
    expect(responseToDelete.statusCode).toBe(204);

    const responseToAllUsersAfterDelete = await request(server).get(BASE_URL);
    expect(responseToAllUsersAfterDelete.body).toEqual([]);
  });
});

describe('Scenario-2, test methods with wrong routes', () => {
  afterAll(() => {
    server.close();
  });

  test('get method should return status code 404 for wrong route', async () => {
    const response = await request(server).get(BASE_URL + '123');
    expect(response.statusCode).toBe(404);
  });

  test('post method should return status code 404 for wrong route', async () => {
    const response = await request(server).post(BASE_URL + '123');
    expect(response.statusCode).toBe(404);
  });

  test('put method should return status code 404 for wrong route', async () => {
    const response = await request(server).put(BASE_URL + '123');
    expect(response.statusCode).toBe(404);
  });

  test('delete method should return status code 404 for wrong route', async () => {
    const response = await request(server).delete(BASE_URL + '123');
    expect(response.statusCode).toBe(404);
  });
});

describe('Scenario-3, test methods with wrong fields in request', () => {
  afterAll(() => {
    server.close();
  });

  test('post method should return status code 400 if body has not all required fields', async () => {
    const userDataWrong = {
      username: 'A',
    };

    const response = await request(server).post(BASE_URL).send(userDataWrong);
    expect(response.statusCode).toBe(400);
  });

  test('post method should return status code 400 if body has incorrect data types in fields', async () => {
    const userDataWrong = {
      username: 'A',
      age: 'aaaaa',
      hobbies: ['hobby1', 'hobby2'],
    };

    const response = await request(server).post(BASE_URL).send(userDataWrong);
    expect(response.statusCode).toBe(400);
  });

  test('put method should return status code 400 if body has not all required fields', async () => {
    const userData = {
      username: 'A',
      age: 10,
      hobbies: ['hobby1', 'hobby2'],
    };
    const newUserDataWrong = {
      username: 'A',
    };

    const response = await request(server).post(BASE_URL).send(userData);
    const userId = response.body.id;

    const responsePut = await request(server)
      .put(BASE_URL + `/${userId}`)
      .send(newUserDataWrong);

    expect(responsePut.statusCode).toBe(400);
  });

  test('post method should return status code 400 if body has incorrect data types in fields', async () => {
    const userData = {
      username: 'A',
      age: 10,
      hobbies: ['hobby1', 'hobby2'],
    };
    const newUserDataWrong = {
      username: 'A',
      age: '10',
      hobbies: ['hobby1', 'hobby2'],
    };

    const response = await request(server).post(BASE_URL).send(userData);
    const userId = response.body.id;

    const responsePut = await request(server)
      .put(BASE_URL + `/${userId}`)
      .send(newUserDataWrong);

    expect(responsePut.statusCode).toBe(400);
  });
});

describe('Scenario-4 tests methods with different id', () => {
  afterAll(() => {
    server.close();
  });

  test('get method should return status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    const wrongId = '123';
    const correctMessage = 'userId is invalid (not uuid)';
    const response = await request(server).get(BASE_URL + '/' + wrongId);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(correctMessage);
  });

  test("get method should return status code 404 and corresponding message if corresponding message if record with id === userId doesn't exist", async () => {
    const correctId = uuidv4();
    const correctMessage = `user with ${correctId} doesn't exist`;
    const response = await request(server).get(BASE_URL + '/' + correctId);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(correctMessage);
  });

  test('delete method should return status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    const wrongId = '123';
    const correctMessage = 'userId is invalid (not uuid)';
    const response = await request(server).delete(BASE_URL + '/' + wrongId);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(correctMessage);
  });

  test("delete method should return status code 404 and corresponding message if corresponding message if record with id === userId doesn't exist", async () => {
    const correctId = uuidv4();
    const correctMessage = `user with ${correctId} doesn't exist`;
    const response = await request(server).delete(BASE_URL + '/' + correctId);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(correctMessage);
  });
});
