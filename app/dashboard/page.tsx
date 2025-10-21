import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard, {session.user?.name || session.user?.email}!</h1>
      <p className="mt-4">This is a protected server-rendered page. Fetch and display user-specific data here.</p>
    </div>
  );
}
