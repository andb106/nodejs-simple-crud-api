import { ServerResponse } from 'node:http';

export const createServerResponse = (
  res: ServerResponse,
  statusCode: number,
  data: unknown,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
