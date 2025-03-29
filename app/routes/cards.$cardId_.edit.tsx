import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { NoteEditor } from "~/components/anki/note-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { useCardInfo } from "~/lib/hooks/useAnkiConnect";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loading } from "~/components/ui/loading";
import { ErrorDisplay } from "~/components/ui/error-display";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.cardId) {
    throw new Response("Card ID is required", { status: 404 });
  }
  return json({ cardId: parseInt(params.cardId, 10) });
};

export default function EditCard() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const numericCardId = cardId ? parseInt(cardId, 10) : 0;

  const { data: card, isLoading, error, refetch } = useCardInfo(numericCardId);

  const handleNoteSaved = (noteId: number) => {
    toast({
      title: "笔记已更新",
      description: `成功更新笔记 #${noteId}`,
    });

    navigate(`/cards/${cardId}`);
  };

  if (isLoading) {
    return (
      <RootLayout>
        <Loading size="lg" text="加载卡片信息..." />
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
          <h1 className="text-2xl font-bold">编辑卡片</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>编辑卡片内容</CardTitle>
            <CardDescription>
              修改笔记内容以更新此卡片
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoteEditor
              noteId={card.note}
              defaultDeckName={card.deckName}
              onSaved={handleNoteSaved}
              isEditMode={true}
            />
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}