import http from 'node:http';
import {
  deleteUserById,
  getUserById,
  getUsers,
  postUser,
  updateUser,
} from './userController';
import { createServerResponse } from './utils';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/users') {
    getUsers(req, res);
  } else if (
    req.method === 'GET' &&
    req.url?.startsWith('/api/users/') &&
    req.url.split('/').length === 4
  ) {
    const id = req.url.split('/')[3] || '';
    getUserById(req, res, id);
  } else if (req.method === 'POST' && req.url === '/api/users') {
    postUser(req, res);
  } else if (
    req.method === 'PUT' &&
    req.url?.startsWith('/api/users/') &&
    req.url.split('/').length === 4
  ) {
    const id = req.url.split('/')[3] || '';
    updateUser(req, res, id);
  } else if (
    req.method === 'DELETE' &&
    req.url?.startsWith('/api/users/') &&
    req.url.split('/').length === 4
  ) {
    const id = req.url.split('/')[3] || '';
    deleteUserById(req, res, id);
  } else {
    createServerResponse(res, 404, { message: 'route not found' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
