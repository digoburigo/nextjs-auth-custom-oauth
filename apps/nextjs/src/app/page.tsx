import { AuthShowcase } from "./_components/auth-showcase";

export default async function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
          Custom OAuth Provider
        </h1>
        <AuthShowcase />
      </div>
    </main>
  );
}
