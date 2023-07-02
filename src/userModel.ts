interface User {
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
