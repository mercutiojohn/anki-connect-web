import { useParams, Link, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { CardView } from "~/components/anki/card-view";
import { Button } from "~/components/ui/button";
import { useCardInfo } from "~/lib/hooks/useAnkiConnect";
import { ArrowLeft, Pencil } from "lucide-react";
import { Loading } from "~/components/ui/loading";
import { ErrorDisplay } from "~/components/ui/error-display";
import { safeUrlEncode } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.cardId) {
    throw new Response("Card ID is required", { status: 404 });
  }
  return json({ cardId: params.cardId });
};

export default function CardDetail() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const numericCardId = cardId ? parseInt(cardId, 10) : 0;
  const { data: card, isLoading, error, refetch } = useCardInfo(numericCardId);

  if (isLoading) {
    return (
      <RootLayout>
        <Loading size="lg" text="加载卡片中..." />
      </RootLayout>
    );
  }

  if (error || !card) {
    return (
      <RootLayout>
        <div className="space-y-4">
          <ErrorDisplay
            title="加载卡片失败"
            error={error}
            retry={() => refetch()}
          />
          <Button onClick={() => navigate(-1)}>返回</Button>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">卡片详情</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="col-span-2">
            <CardView cardId={numericCardId} />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>卡片信息</CardTitle>
                <CardDescription>
                  卡片详细信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">ID</div>
                  <div>{card.cardId}</div>
                  <div className="font-medium">牌组</div>
                  <div>{card.deckName}</div>
                  <div className="font-medium">模型</div>
                  <div>{card.modelName}</div>
                  <div className="font-medium">复习次数</div>
                  <div>{card.reps}</div>
                  <div className="font-medium">失败次数</div>
                  <div>{card.lapses}</div>
                  <div className="font-medium">间隔</div>
                  <div>{card.interval} 天</div>
                  <div className="font-medium">笔记 ID</div>
                  <div>{card.note}</div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`/decks/${safeUrlEncode(card.deckName)}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回牌组
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}