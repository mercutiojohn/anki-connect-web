import { useState } from "react";
import { useParams, Link, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { DeckStats } from "~/components/anki/deck-stats";
import { Button } from "~/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "~/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { useCardsByQuery, useCardsInfo, useDeleteDeck } from "~/lib/hooks/useAnkiConnect";
import { BookOpen, Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Loading } from "~/components/ui/loading";
import { ErrorDisplay } from "~/components/ui/error-display";
import { DataTable } from "~/components/ui/data-table";
import { CardInfo } from "~/lib/anki-connect/cards";
import { useToast } from "~/hooks/use-toast";
import { safeUrlEncode } from "~/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.deckName) {
    throw new Response("Deck name is required", { status: 404 });
  }
  return json({ deckName: params.deckName });
};

export default function DeckDetail() {
  const { deckName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const decodedDeckName = deckName ? decodeURIComponent(deckName) : "";
  const [searchTerm, setSearchTerm] = useState("");

  const deleteDeckMutation = useDeleteDeck();

  const query = `deck:"${decodedDeckName}" ${searchTerm}`.trim();
  const {
    data: cardIds,
    isLoading: isLoadingCardIds,
    error: cardIdsError,
    refetch
  } = useCardsByQuery(query);

  // 获取卡片详情
  const {
    data: cardsInfo,
    isLoading: isLoadingCardsInfo,
    error: cardsInfoError,
  } = useCardsInfo(cardIds || []);

  const isLoading = isLoadingCardIds || isLoadingCardsInfo;
  const error = cardIdsError || cardsInfoError;

  const handleDeleteDeck = async () => {
    try {
      await deleteDeckMutation.mutateAsync(decodedDeckName);
      toast({
        title: "牌组已删除",
        description: `成功删除牌组 "${decodedDeckName}"`
      });
      navigate("/decks");
    } catch (error) {
      toast({
        title: "删除牌组失败",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    }
  };

  const columns: ColumnDef<CardInfo>[] = [
    {
      accessorKey: "cardId",
      header: "ID",
      cell: ({ row }) => <div>#{row.original.cardId}</div>,
    },
    {
      accessorKey: "question",
      header: "问题",
      cell: ({ row }) => (
        <div
          className="max-w-md truncate"
          dangerouslySetInnerHTML={{
            __html: row.original.question
              .replace(/<[^>]*>/g, '')
              .substring(0, 100) + (row.original.question.length > 100 ? '...' : '')
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

  return (
    <RootLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{decodedDeckName}</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to={`/decks/${safeUrlEncode(decodedDeckName)}/add`}>
                <Plus className="mr-2 h-4 w-4" />添加卡片
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/decks/${safeUrlEncode(decodedDeckName)}/review`}>
                <BookOpen className="mr-2 h-4 w-4" />开始学习
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>卡片列表</CardTitle>
                  <CardDescription>
                    {isLoading ? '加载中...' : `共 ${cardIds?.length || 0} 张卡片`}
                  </CardDescription>
                </div>
                <Input
                  placeholder="搜索卡片..."
                  className="w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loading text="加载卡片列表..." />
                ) : error ? (
                  <ErrorDisplay
                    title="加载卡片失败"
                    error={error}
                    retry={refetch}
                  />
                ) : cardsInfo && cardsInfo.length > 0 ? (
                  <DataTable
                    columns={columns}
                    data={cardsInfo}
                    pageSize={10}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    该牌组中没有卡片
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="space-y-4">
              <DeckStats deckName={decodedDeckName} />

              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>牌组操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/decks/${safeUrlEncode(decodedDeckName)}/add`}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加卡片
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/decks/${safeUrlEncode(decodedDeckName)}/review`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      开始学习
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除牌组
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除牌组</AlertDialogTitle>
                        <AlertDialogDescription>
                          您确定要删除 "{decodedDeckName}" 牌组吗？此操作无法撤销，所有卡片将一并被删除。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteDeck}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {deleteDeckMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}