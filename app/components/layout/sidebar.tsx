import { useState } from "react";
import { NavLink } from "@remix-run/react";
import { useDeckNames } from "~/lib/hooks/useAnkiConnect";
import {
  ChevronRight,
  ChevronDown,
  Home,
  Library,
  Settings,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showDecks, setShowDecks] = useState(true);

  const { data: deckNames, isLoading } = useDeckNames();

  return (
    <aside className={`border-r bg-background ${isOpen ? "w-64" : "w-14"} transition-all duration-300`}>
      <div className="h-full flex flex-col">
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-start"
          >
            {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <Separator />

        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              <Home className="h-4 w-4" />
              {isOpen && <span>主页</span>}
            </NavLink>

            <div>
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => setShowDecks(!showDecks)}
              >
                <div className="flex items-center gap-2">
                  <Library className="h-4 w-4" />
                  {isOpen && <span>牌组</span>}
                </div>
                {isOpen && (showDecks ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
              </div>

              {isOpen && showDecks && (
                <div className="ml-4 mt-1 space-y-1">
                  {isLoading ? (
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">加载中...</span>
                    </div>
                  ) : deckNames && deckNames.length > 0 ? (
                    deckNames.map((name) => (
                      <NavLink
                        key={name}
                        to={`/decks/${encodeURIComponent(name)}`}
                        className={({ isActive }) =>
                          `block text-sm px-3 py-1.5 rounded-md ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`
                        }
                      >
                        {name}
                      </NavLink>
                    ))
                  ) : (
                    <div className="text-sm px-3 py-2 text-muted-foreground">
                      无牌组
                    </div>
                  )}

                  <NavLink
                    to="/decks/create"
                    className={({ isActive }) =>
                      `flex items-center gap-1 text-sm px-3 py-1.5 rounded-md ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`
                    }
                  >
                    <Plus className="h-3 w-3" />
                    <span>创建牌组</span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/settings"
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              <Settings className="h-4 w-4" />
              {isOpen && <span>设置</span>}
            </NavLink>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
