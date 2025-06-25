import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id: number;
      nombre: string;
      imagen?: string;
      roles?: string[];
    };
  }

  interface User extends DefaultUser {
    id: number;
    nombre: string;
    imagen?: string;
    roles?: string[];
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: number;
      nombre: string;
      imagen?: string;
      roles?: string[];
    };
  }
}
