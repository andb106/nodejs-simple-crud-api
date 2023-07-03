import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

let usersDataBase: User[] = [];

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

export const updateUser = (
  id: string,
  data: Omit<User, 'id'>,
): Promise<User | undefined> => {
  return new Promise((resolve) => {
    const userIndex = usersDataBase.findIndex((user) => user.id === id);
    usersDataBase[userIndex] = { id, ...data };
    resolve(usersDataBase[userIndex]);
  });
};

export const deleteUser = (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    const userIndex = usersDataBase.findIndex((user) => user.id === id);
    const deletedUser = usersDataBase[userIndex];
    usersDataBase = usersDataBase.filter((user) => user.id !== id);
    resolve(deletedUser);
  });
};
