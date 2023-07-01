import { IncomingMessage, ServerResponse } from 'node:http';
import * as UserModel from './userModel';
import { createServerResponse } from './utils';

export const getUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await UserModel.getAll();
    createServerResponse(res, 200, users);
  } catch (error) {
    console.log(error);
  }
};
