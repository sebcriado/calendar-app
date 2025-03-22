export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="w-full px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Calendrier hebdomadaire</h1>
        </div>
      </header>
      <main className="w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}