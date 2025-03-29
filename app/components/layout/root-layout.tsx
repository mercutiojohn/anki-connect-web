import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { ConnectionStatus } from "~/components/anki/connection-status";
import { Toaster } from "~/components/ui/toaster";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6">
          <div className="container max-w-7xl mx-auto">
            <div className="mb-4 flex justify-end">
              <ConnectionStatus />
            </div>
            {children}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
