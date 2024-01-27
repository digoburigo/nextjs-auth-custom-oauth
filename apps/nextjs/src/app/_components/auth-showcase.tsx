import { auth, signIn, signOut } from "@acme/auth";

export async function AuthShowcase() {
  const session = await auth();
  console.log(`CURRENT SESSION:`, session);

  if (!session) {
    return (
      <form>
        <button
          formAction={async () => {
            "use server";
            await signIn("foo");
          }}
        >
          Sign in with foo
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {session && <span>Logged in as {JSON.stringify(session)}</span>}
      </p>

      <form>
        <button
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
