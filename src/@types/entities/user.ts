export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string | null;
};

export type UserWithPassword = User & {
  password: string;
};
