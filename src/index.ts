import http from 'node:http';
import { getUsers } from './userController';
import { createServerResponse } from './utils';

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/users') {
    getUsers(req, res);
  } else {
    createServerResponse(res, 404, { message: 'route not found' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
