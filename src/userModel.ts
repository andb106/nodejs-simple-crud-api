import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const usersDataBase: User[] = [
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    username: '123',
    age: 12,
    hobbies: ['12', '444'],
  },
];

export const getAll = (): Promise<User[]> => {
  return new Promise((resolve) => {
    resolve(usersDataBase);
  });
};

export const getById = (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    const user = usersDataBase.find((item) => item.id === id);
    resolve(user);
  });
};

export const create = (data: Omit<User, 'id'>): Promise<User> => {
  const newUser = { id: uuidv4(), ...data };
  usersDataBase.push(newUser);
  return new Promise((resolve) => {
    resolve(newUser);
  });
};
