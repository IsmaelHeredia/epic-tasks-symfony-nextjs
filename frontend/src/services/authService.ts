import { signIn } from "next-auth/react";
import { ValidarIngreso } from "@/types/app/login";
import { createSingleton } from "@/lib/singleton";

class AuthService {
  async loginUser(data: ValidarIngreso) {
    const result = await signIn("credentials", {
      redirect: false,
      nombre: data.username,
      clave: data.password,
    });

    if (!result) throw new Error("No se recibió respuesta de NextAuth");
    if (!result.ok) throw new Error("Credenciales inválidas");

    return result;
  }
}

export const useAuthService = createSingleton(() => new AuthService());
