interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const usersDataBase: User[] = [];

export const getAll = (): Promise<User[]> => {
  return new Promise((resolve) => {
    resolve(usersDataBase);
  });
};
