import { useDeckStats, useDeckNamesAndIds } from "~/lib/hooks/useAnkiConnect";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DeckStatsProps {
  deckName: string;
}

export function DeckStats({ deckName }: DeckStatsProps) {
  const [deckId, setDeckId] = useState<number | null>(null);
  const { data: decksMap, isLoading: isLoadingMap } = useDeckNamesAndIds();

  // 根据deckName获取deckId
  useEffect(() => {
    if (decksMap && deckName) {
      setDeckId(decksMap[deckName] || null);
    }
  }, [decksMap, deckName]);

  const { data: deckStats, isLoading: isLoadingStats, error } = useDeckStats(deckId || 0);

  const isLoading = isLoadingMap || isLoadingStats || !deckId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>加载统计信息...</span>
      </div>
    );
  }

  if (error || !deckStats) {
    return (
      <div className="p-4 text-red-500">
        加载统计信息失败: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  const totalToStudy = deckStats.new_count + deckStats.learn_count + deckStats.review_count;
  const hasCards = deckStats.total_in_deck > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">牌组统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{deckStats.new_count}</div>
              <div className="text-sm text-muted-foreground">新卡片</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{deckStats.learn_count}</div>
              <div className="text-sm text-muted-foreground">学习中</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{deckStats.review_count}</div>
              <div className="text-sm text-muted-foreground">待复习</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>今日进度</span>
              <span>{totalToStudy} 剩余 / {deckStats.total_in_deck} 总计</span>
            </div>
            <Progress
              value={hasCards ? ((deckStats.total_in_deck - totalToStudy) / deckStats.total_in_deck) * 100 : 0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
