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
  if (validate(id)) {
    try {
      const user = await UserModel.getById(id);

      user
        ? createServerResponse(res, 200, user)
        : createServerResponse(res, 404, {
            message: `user with ${id} doesn't exist`,
          });
    } catch (error) {
      console.log(error);
    }
  } else {
    createServerResponse(res, 400, { message: 'userId is invalid (not uuid)' });
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
