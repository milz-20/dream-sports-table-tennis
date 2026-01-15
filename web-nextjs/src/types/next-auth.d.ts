import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      customerId?: string;
      phone?: string;
    };
  }

  interface User {
    customerId?: string;
    phone?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    customerId?: string;
    phone?: string;
  }
}
