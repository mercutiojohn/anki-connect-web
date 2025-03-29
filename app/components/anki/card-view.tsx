import { useState } from "react";
import { useCardInfo } from "~/lib/hooks/useAnkiConnect";
import { Card, CardContent as UICardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Loader2 } from "lucide-react";
import { AnkiCardContent } from "./card-content";

interface CardViewProps {
  cardId: number;
}

export function CardView({ cardId }: CardViewProps) {
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          卡片 #{cardInfo.cardId}
          <span className="text-sm font-normal ml-2 text-muted-foreground">
            {cardInfo.modelName}
          </span>
        </CardTitle>
      </CardHeader>
      <UICardContent className="space-y-4">
        <AnkiCardContent
          cardInfo={cardInfo}
          showAnswer={false}
        />
        <AnkiCardContent
          cardInfo={cardInfo}
          showAnswer={true}
          showToggleButton={false}
        />
      </UICardContent>
      <CardFooter>
        <div className="w-full text-sm text-muted-foreground">
          <p>牌组: {cardInfo.deckName}</p>
          <p>间隔: {cardInfo.interval} 天 | 复习次数: {cardInfo.reps} | 失败次数: {cardInfo.lapses}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
