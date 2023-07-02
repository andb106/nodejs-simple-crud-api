import { IncomingMessage, ServerResponse } from 'node:http';

export const createServerResponse = (
  res: ServerResponse,
  statusCode: number,
  data: unknown,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const getRequestData = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      let requestData = '';

      req.on('data', (chunk: string) => {
        requestData += chunk.toString();
      });

      req.on('end', () => {
        resolve(requestData);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const validDataToCreateUser = (requestData: string) => {
  try {
    const dataToCheck = JSON.parse(requestData);
    if (typeof dataToCheck === 'object' && dataToCheck !== 'null') {
      if (
        typeof dataToCheck?.age === 'number' &&
        typeof dataToCheck?.username === 'string' &&
        Array.isArray(dataToCheck?.hobbies)
      ) {
        return {
          age: dataToCheck.age,
          username: dataToCheck.username,
          hobbies: dataToCheck.hobbies,
        };
      } else {
        return;
      }
    }
  } catch (error) {
    return;
  }
};
