import { useState } from "react";
import { CardInfo } from "~/lib/anki-connect/cards";
import { DataTable } from "~/components/ui/data-table";
import { CardGrid } from "~/components/ui/card-grid";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { List, Grid, Pencil, Eye, EyeOff } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "~/components/ui/card";
import { Loading } from "~/components/ui/loading";
import { ErrorDisplay } from "~/components/ui/error-display";

interface CardListProps {
  cards: CardInfo[] | undefined;
  isLoading: boolean;
  error: Error | null;
  totalCards: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
}

export function CardList({
  cards,
  isLoading,
  error,
  totalCards,
  searchTerm,
  onSearchChange,
  onRefresh
}: CardListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const navigate = useNavigate();
  // 用于跟踪每张卡片的显示状态（问题/答案）
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  // 跟踪全局显示答案状态
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const handleCardClick = (card: CardInfo) => {
    navigate(`/cards/${card.cardId}`);
  };

  // 切换指定卡片的显示状态
  const toggleCardAnswer = (cardId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
    setShowAnswers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // 切换所有卡片的显示状态
  const toggleAllAnswers = () => {
    if (!cards) return;

    const newShowAllAnswers = !showAllAnswers;
    setShowAllAnswers(newShowAllAnswers);

    // 创建新的状态对象
    const newAnswerStates: Record<number, boolean> = {};
    cards.forEach(card => {
      newAnswerStates[card.cardId] = newShowAllAnswers;
    });

    setShowAnswers(newAnswerStates);
  };

  const columns: ColumnDef<CardInfo>[] = [
    {
      accessorKey: "question",
      header: "问题",
      cell: ({ row }) => (
        <div
          className="max-w-xl truncate card"
          dangerouslySetInnerHTML={{
            __html: row.original.question
          }}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link to={`/cards/${row.original.cardId}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )
      },
    },
  ];

  // 检查当前的显示答案状态是否与全局状态一致
  const checkAnswerStateConsistency = () => {
    if (!cards || cards.length === 0) return false;

    const currentCardsWithAnswers = cards.filter(card => showAnswers[card.cardId]).length;

    // 如果所有卡片都显示了答案，但全局状态是 false，更新全局状态
    if (currentCardsWithAnswers === cards.length && !showAllAnswers) {
      setShowAllAnswers(true);
      return true;
    }

    // 如果没有卡片显示答案，但全局状态是 true，更新全局状态
    if (currentCardsWithAnswers === 0 && showAllAnswers) {
      setShowAllAnswers(false);
      return false;
    }

    return showAllAnswers;
  };

  // 当卡片数据或显示状态变化时检查一致性
  const isAllAnswersShown = checkAnswerStateConsistency();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>卡片列表</CardTitle>
          <CardDescription>
            {isLoading ? '加载中...' : `共 ${totalCards} 张卡片`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllAnswers}
            className="mr-2"
          >
            {showAllAnswers ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                隐藏所有答案
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                显示所有答案
              </>
            )}
          </Button>
          <Input
            placeholder="搜索卡片..."
            className="w-[200px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "list" | "grid")}>
            <ToggleGroupItem value="list" aria-label="列表视图">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="网格视图">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loading text="加载卡片列表..." />
        ) : error ? (
          <ErrorDisplay
            title="加载卡片失败"
            error={error}
            retry={onRefresh}
          />
        ) : cards && cards.length > 0 ? (
          viewMode === "list" ? (
            <DataTable
              columns={columns}
              data={cards}
              pageSize={10}
            />
          ) : (
            <CardGrid
              showTitle={false}
              columns={columns}
              data={cards}
              pageSize={6}
              onCardClick={handleCardClick} // 添加卡片点击事件
              // renderTitle={(card) => (
              //   // <div
              //   //   className="truncate"
              //   //   dangerouslySetInnerHTML={{
              //   //     __html: card.question
              //   //       .replace(/<[^>]*>/g, '')
              //   //       .substring(0, 50) + (card.question.length > 50 ? '...' : '')
              //   //   }}
              //   // />
              //   <div
              //     dangerouslySetInnerHTML={{
              //       __html: card.question
              //     }}
              //   />
              // )}
              renderContent={(card) => (
                <div className="space-y-2">
                  <div className="mt-2 text-sm">
                    <div
                      className="card"
                      dangerouslySetInnerHTML={{
                        __html: showAnswers[card.cardId] ? card.answer : card.question
                      }}
                    />
                  </div>
                </div>
              )}
              renderFooter={(card) => (
                <div className="flex w-full justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => toggleCardAnswer(card.cardId, e)}
                  >
                    {showAnswers[card.cardId] ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        隐藏答案
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        显示答案
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={`/cards/${card.cardId}`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      编辑
                    </Link>
                  </Button>
                </div>
              )}
            />
          )
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            该牌组中没有卡片
          </div>
        )}
      </CardContent>
    </Card>
  );
}