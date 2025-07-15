import { ETypeUser } from '../enums/ETypeUser.enum';

export interface User {
  userID: number;
  name: string;
  email: string;
  typeUser: { type: ETypeUser };
  numberPhone: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
} 