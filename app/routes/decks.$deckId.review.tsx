import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { ReviewCard } from "~/components/anki/review-card";
import { Button } from "~/components/ui/button";
import { useCardsByQuery, useDeckNamesAndIds } from "~/lib/hooks/useAnkiConnect";
import { ankiConnectInvoke } from "~/lib/anki-connect/api";
import { Loader2, ArrowLeft } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { useToast } from "~/hooks/use-toast";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.deckId) {
    throw new Response("Deck ID is required", { status: 404 });
  }
  return json({ deckId: parseInt(params.deckId) });
};

export default function ReviewDeck() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const numericDeckId = deckId ? parseInt(deckId) : 0;
  const [deckName, setDeckName] = useState<string | null>(null);

  // 获取所有牌组ID和名称的映射
  const { data: decksMap, isLoading: isLoadingDecks } = useDeckNamesAndIds();

  // 根据deckId查找deckName
  useEffect(() => {
    if (decksMap && numericDeckId) {
      const foundDeckName = Object.keys(decksMap).find(key => decksMap[key] === numericDeckId);
      setDeckName(foundDeckName || null);
    }
  }, [decksMap, numericDeckId]);

  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // 只有在获取到牌组名称后才执行查询
  const query = deckName ? `deck:"${deckName}" is:due` : "";
  const { data: cardIds, isLoading: isLoadingCards, error } = useCardsByQuery(query);

  const isLoading = isLoadingDecks || isLoadingCards || !deckName;

  useEffect(() => {
    if (cardIds && cardIds.length === 0) {
      setIsFinished(true);
    }
  }, [cardIds]);

  const handleAnswer = async (ease: 1 | 2 | 3 | 4) => {
    if (!cardIds || cardIds.length === 0) return;

    setIsAnswering(true);

    try {
      // 使用 AnkiConnect API 回答卡片
      await ankiConnectInvoke("guiAnswerCard", { ease });

      // 更新状态
      setReviewedCount((prev) => prev + 1);

      // 移动到下一张卡片
      if (currentCardIdx < cardIds.length - 1) {
        setCurrentCardIdx((prev) => prev + 1);
      } else {
        setIsFinished(true);
        toast({
          title: "复习完成",
          description: `您已完成 ${deckName} 牌组的复习`,
        });
      }
    } catch (error) {
      toast({
        title: "回答卡片失败",
        description: `无法记录答案: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsAnswering(false);
    }
  };

  const progress = cardIds && cardIds.length > 0
    ? Math.round((reviewedCount / cardIds.length) * 100)
    : 0;

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>加载牌组信息...</span>
        </div>
      </RootLayout>
    );
  }

  // 如果找不到牌组，显示错误信息
  if (!deckName) {
    return (
      <RootLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">找不到牌组</h2>
          <p className="mt-2 text-muted-foreground">无法找到ID为 {deckId} 的牌组</p>
          <Button className="mt-4" onClick={() => navigate("/decks")}>
            返回牌组列表
          </Button>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">复习 {deckName}</h1>
          <Button variant="outline" onClick={() => navigate(`/decks/${numericDeckId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回牌组
          </Button>
        </div>

        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">加载卡片失败: {error instanceof Error ? error.message : String(error)}</p>
            <Button onClick={() => navigate(`/decks/${numericDeckId}`)}>返回牌组</Button>
          </div>
        ) : isFinished || !cardIds || cardIds.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              {reviewedCount > 0 ? "复习完成！" : "没有待复习的卡片"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {reviewedCount > 0
                ? `您已经复习了 ${reviewedCount} 张卡片`
                : "该牌组中没有需要复习的卡片"}
            </p>
            <Button onClick={() => navigate(`/decks/${numericDeckId}`)}>
              返回牌组
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>复习进度</span>
                <span>{reviewedCount} / {cardIds.length} 卡片</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="py-4">
              <ReviewCard
                cardId={cardIds[currentCardIdx]}
                onAnswer={handleAnswer}
              />
            </div>
          </>
        )}
      </div>
    </RootLayout>
  );
}