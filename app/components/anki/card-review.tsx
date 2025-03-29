import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent as UICardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { useCardInfo } from "~/lib/hooks/useAnkiConnect";
import { AnkiCardContent, CardContent } from "./card-content";

interface ReviewCardProps {
  cardId: number;
  onAnswer?: (ease: 1 | 2 | 3 | 4) => void;
}

export function ReviewCard({ cardId, onAnswer }: ReviewCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const { data: cardInfo, isLoading, error } = useCardInfo(cardId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载卡片中...</span>
      </div>
    );
  }

  if (error || !cardInfo) {
    return (
      <div className="p-4 text-red-500">
        加载卡片失败: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  const handleAnswer = (ease: 1 | 2 | 3 | 4) => {
    if (onAnswer) {
      onAnswer(ease);
    }
    setShowAnswer(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="text-sm text-muted-foreground">
          {cardInfo.deckName}
        </div>
      </CardHeader>
      <UICardContent className="space-y-6">
        {!showAnswer ? (
          <>
            <AnkiCardContent
              cardInfo={cardInfo}
              showAnswer={false}
              showToggleButton={false}
            />
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setShowAnswer(true)}
              >
                显示答案
              </Button>
            </div>
          </>
        ) : (
          <>
            <AnkiCardContent
              cardInfo={cardInfo}
              showAnswer={false}
              showToggleButton={false}
            />
            <AnkiCardContent
              cardInfo={cardInfo}
              showAnswer={true}
              showToggleButton={false}
            />

            <div className="rating-buttons grid grid-cols-4 gap-2 mt-8">
              <Button
                variant="destructive"
                onClick={() => handleAnswer(1)}
              >
                忘记
              </Button>
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                onClick={() => handleAnswer(2)}
              >
                困难
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => handleAnswer(3)}
              >
                良好
              </Button>
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleAnswer(4)}
              >
                简单
              </Button>
            </div>
          </>
        )}
      </UICardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        间隔: {cardInfo.interval} 天 | 复习次数: {cardInfo.reps} | 失败次数: {cardInfo.lapses}
      </CardFooter>
    </Card>
  );
}
