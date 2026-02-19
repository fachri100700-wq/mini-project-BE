import { Role } from "../../generated/prisma/client";

export type RegisterDTO = {
  email: string;
  username: string;
  password: string;
  role: Role;
  referralCode?: string; // optional user input
};

export type LoginDTO = {
  email: string;
  password: string;
};
