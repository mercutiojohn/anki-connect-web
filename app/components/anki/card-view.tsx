import { useState } from "react";
import { useCardInfo } from "~/lib/hooks/useAnkiConnect";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Separator } from "~/components/ui/separator";

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
      <CardContent className="space-y-4">
        <div className="card-content">
          <h3 className="text-lg font-medium mb-2">问题</h3>
          <div className="card-question p-4 bg-muted rounded-md">
            <div
              className="card"
              dangerouslySetInnerHTML={{ __html: cardInfo.question }}
            />
          </div>
        </div>

        <Separator />

        <div className="card-content">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">答案</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" /> 隐藏
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" /> 显示
                </>
              )}
            </Button>
          </div>

          {showAnswer ? (
            <div
              className="card-answer p-4 bg-muted rounded-md"
            >
              <div
                className="card"
                dangerouslySetInnerHTML={{ __html: cardInfo.answer }}
              />
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-md text-center text-muted-foreground">
              点击显示按钮查看答案
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-sm text-muted-foreground">
          <p>牌组: {cardInfo.deckName}</p>
          <p>间隔: {cardInfo.interval} 天 | 复习次数: {cardInfo.reps} | 失败次数: {cardInfo.lapses}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
