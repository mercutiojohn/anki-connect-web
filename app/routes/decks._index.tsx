import { useAllDeckStats } from "~/lib/hooks/useAnkiConnect";
import { Link } from "@remix-run/react";
import { RootLayout } from "~/components/layout/root-layout";
import { DeckList } from "~/components/anki/deck-list";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Loading } from "~/components/ui/loading";
import { ErrorDisplay } from "~/components/ui/error-display";

export default function DecksIndex() {
  const { isLoading, error, refetch } = useAllDeckStats();

  return (
    <RootLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">所有牌组</h1>
          <Button asChild>
            <Link to="/decks/create">
              <Plus className="mr-2 h-4 w-4" /> 新建牌组
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Loading text="加载牌组中..." size="lg" />
        ) : error ? (
          <ErrorDisplay
            title="加载牌组失败"
            error={error}
            retry={refetch}
          />
        ) : (
          <DeckList />
        )}
      </div>
    </RootLayout>
  );
}