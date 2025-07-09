import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const backendUrl = process.env.INTERNAL_BACKEND_URL
  ? process.env.INTERNAL_BACKEND_URL
  : process.env.NEXT_PUBLIC_BACKEND_URL;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nombre: { label: "Nombre", type: "text" },
        clave: { label: "Clave", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${backendUrl}/api/usuario/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: credentials?.nombre,
            clave: credentials?.clave,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.token || !data.usuario) {
          return null;
        }

        return {
          id: data.usuario.id,
          nombre: data.usuario.nombre,
          imagen: data.usuario.imagen,
          roles: data.usuario.roles,
          token: data.token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          id: Number(user.id),
          nombre: user.nombre,
          imagen: user.imagen,
          roles: user.roles,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
