import { Link } from "@remix-run/react";
import { BookOpen } from "lucide-react";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <Link to="/" className="text-lg font-semibold">
            Anki Connect Web
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/decks">牌组</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/settings">设置</Link>
            </Button>
          </nav>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
