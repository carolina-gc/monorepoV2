import { ETypeUser } from "../../domain/enums/typeuser.enum";

export interface UserAuth {
  id: number;
  email: string;
  typeUser: ETypeUser;
  numberPhone: string;
  countryCode: string;
}

export interface LoginResponse {
  user: UserAuth;
  token: string;
}
