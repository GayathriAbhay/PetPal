// pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github"; 
// You'll need to define your providers here

import prisma from "../../../lib/prisma"; // 👈 Use your new prisma client

export const authOptions = {
  // 1. ADAPTER: Connects NextAuth to TiDB via your specialized Prisma client
  adapter: PrismaAdapter(prisma),

  // 2. PROVIDERS: Define your authentication methods
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Add other providers (Google, Email, etc.) as needed
  ],

  // 3. SECURITY & SESSION: Use the database for session storage
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);