import { useAllDeckStats } from "~/lib/hooks/useAnkiConnect";
import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Loader2, BookOpen } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { safeUrlEncode } from "~/lib/utils";

export function DeckList() {
  const { data: decks, isLoading, error } = useAllDeckStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载牌组中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        加载牌组失败: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  if (!decks || decks.length === 0) {
    return <div className="p-4">没有找到牌组。请在 Anki 中创建牌组。</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <Card key={deck.name} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{deck.name}</CardTitle>
            <CardDescription>
              共 {deck.total_in_deck} 张卡片
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary">{deck.new_count} 新卡</Badge>
                  </TooltipTrigger>
                  <TooltipContent>新卡片</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline">{deck.learn_count} 学习中</Badge>
                  </TooltipTrigger>
                  <TooltipContent>学习中的卡片</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge>{deck.review_count} 待复习</Badge>
                  </TooltipTrigger>
                  <TooltipContent>需要复习的卡片</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/decks/${safeUrlEncode(deck.name)}`}>
                  查看
                </Link>
              </Button>
              {(deck.new_count > 0 || deck.learn_count > 0 || deck.review_count > 0) && (
                <Button
                  size="sm"
                  asChild
                >
                  <Link to={`/decks/${safeUrlEncode(deck.name)}/review`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    学习
                  </Link>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
