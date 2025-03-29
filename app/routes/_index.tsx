import { useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { useAnkiConnectStatus, useAllDeckStats } from "~/lib/hooks/useAnkiConnect";
import { RootLayout } from "~/components/layout/root-layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DeckList } from "~/components/anki/deck-list";
import { Loading } from "~/components/ui/loading";
import { ErrorDisplay } from "~/components/ui/error-display";
import { BookOpen, Plus, Settings, Loader2, AlertCircle } from "lucide-react";

export default function Index() {
  const { data: isConnected, isLoading: isCheckingConnection } = useAnkiConnectStatus();
  const { data: decks, isLoading: isLoadingDecks, error: deckError } = useAllDeckStats();
  const navigate = useNavigate();

  // 计算今日学习卡片总数
  const todayCount = decks?.reduce(
    (sum, deck) => sum + deck.new_count + deck.learn_count + deck.review_count,
    0
  ) || 0;

  // 优先显示的牌组（有学习任务的前3个牌组）
  const priorityDecks = decks
    ?.filter(deck => deck.new_count + deck.learn_count + deck.review_count > 0)
    .slice(0, 3) || [];

  return (
    <RootLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">仪表盘</h1>
        </div>

        {isCheckingConnection ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin opacity-30" />
              <p className="mt-4 text-muted-foreground">正在连接到 Anki...</p>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="py-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">未连接到 Anki</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  请确保 Anki 已启动并安装了 AnkiConnect 插件
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Button onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    设置连接
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* 概览统计卡片 */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">今日待学习</CardTitle>
                  <CardDescription>所有牌组</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{todayCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {decks?.length || 0} 个牌组
                  </p>
                </CardContent>
              </Card>

              {/* 快速访问卡片 */}
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">快速访问</CardTitle>
                  <CardDescription>常用功能</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button asChild variant="outline" className="h-auto py-4 flex-1 flex-col items-center">
                    <Link to="/decks">
                      <BookOpen className="h-6 w-6 mb-2" />
                      <span>所有牌组</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 flex-1 flex-col items-center">
                    <Link to="/decks/create">
                      <Plus className="h-6 w-6 mb-2" />
                      <span>新建牌组</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 flex-1 flex-col items-center">
                    <Link to="/settings">
                      <Settings className="h-6 w-6 mb-2" />
                      <span>设置</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 优先学习牌组 */}
            {priorityDecks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">需要学习</h2>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  {priorityDecks.map((deck) => (
                    <Card key={deck.name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{deck.name}</CardTitle>
                        <CardDescription>
                          {deck.new_count + deck.learn_count + deck.review_count} 张卡片待学习
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-end">
                        <Button asChild>
                          <Link to={`/decks/${encodeURIComponent(deck.name)}/review`}>
                            开始学习
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 所有牌组 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">所有牌组</h2>
                <Button asChild variant="outline">
                  <Link to="/decks">查看全部</Link>
                </Button>
              </div>

              {isLoadingDecks ? (
                <Loading text="加载牌组中..." />
              ) : deckError ? (
                <ErrorDisplay error={deckError} />
              ) : (
                <DeckList />
              )}
            </div>
          </>
        )}
      </div>
    </RootLayout>
  );
}
