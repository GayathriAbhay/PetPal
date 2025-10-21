// components/AuthStatus.tsx

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div style={{ padding: '10px', border: '1px solid green' }}>
        Signed in as **{session.user?.email}** <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', border: '1px solid red' }}>
      Not signed in <br />
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    </div>
  );
}