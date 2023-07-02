import { IncomingMessage, ServerResponse } from 'node:http';
import * as UserModel from './userModel';
import {
  createServerResponse,
  getRequestData,
  validDataToCreateUser,
} from './utils';
import { validate } from 'uuid';

export const getUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await UserModel.getAll();
    createServerResponse(res, 200, users);
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    const user = await UserModel.getById(id);
    handleResponseByValidationId(id, res, user, 200);
  } catch (error) {
    console.log('from getUserById', error);
  }
};

export const postUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const data = await getRequestData(req);
    const validData = validDataToCreateUser(data);
    if (!validData) throw new Error();
    const newUser = await UserModel.create(validData);
    createServerResponse(res, 201, newUser);
  } catch (error) {
    createServerResponse(res, 400, {
      message: 'request body does not contain required fields',
    });
  }
};

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    const data = await getRequestData(req);
    const validData = validDataToCreateUser(data);
    if (!validData) throw new Error();

    const updatedUser = await UserModel.updateUser(id, validData);
    handleResponseByValidationId(id, res, updatedUser, 200);
  } catch (error) {
    createServerResponse(res, 400, {
      message: 'request body does not contain required fields',
    });
  }
};

export const deleteUserById = async (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    const user = await UserModel.deleteUser(id);
    handleResponseByValidationId(id, res, user, 204);
  } catch (error) {
    console.log('from getUserById', error);
  }
};

const handleResponseByValidationId = (
  id: string,
  res: ServerResponse,
  user: UserModel.User | undefined,
  statusCodeToSuccess: number,
) => {
  if (validate(id)) {
    user
      ? createServerResponse(res, statusCodeToSuccess, user)
      : createServerResponse(res, 404, {
          message: `user with ${id} doesn't exist`,
        });
  } else {
    createServerResponse(res, 400, { message: 'userId is invalid (not uuid)' });
  }
};
