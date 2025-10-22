import NextAuth from "next-auth";
import authOptions from "@/lib/auth";

export const { GET, POST } = NextAuth(authOptions as any);

export default function handler() {
  // route.ts in Next.js App Router expects exported handlers above
  return new Response(null, { status: 204 });
}
