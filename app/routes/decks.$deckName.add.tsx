import { useParams, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { NoteEditor } from "~/components/anki/note-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { safeUrlEncode } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.deckName) {
    throw new Response("Deck name is required", { status: 404 });
  }
  return json({ deckName: params.deckName });
};

export default function AddCard() {
  const { deckName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const decodedDeckName = deckName ? decodeURIComponent(deckName) : "";

  const handleNoteAdded = (noteId: number) => {
    toast({
      title: "笔记已添加",
      description: `成功创建笔记 #${noteId}`,
    });

    // 使用 safeUrlEncode 确保导航正确
    navigate(`/decks/${safeUrlEncode(decodedDeckName)}`);
  };

  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">添加卡片</h1>
          <p className="text-muted-foreground">添加新卡片到 {decodedDeckName} 牌组</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>创建新卡片</CardTitle>
            <CardDescription>
              填写以下表单创建新的 Anki 卡片
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoteEditor defaultDeckName={decodedDeckName} onSaved={handleNoteAdded} />
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}