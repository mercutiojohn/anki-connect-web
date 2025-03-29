import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { RootLayout } from "~/components/layout/root-layout";
import { NoteEditor } from "~/components/anki/note-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { useDeckNamesAndIds } from "~/lib/hooks/useAnkiConnect";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.deckId) {
    throw new Response("Deck ID is required", { status: 404 });
  }
  return json({ deckId: parseInt(params.deckId) });
};

export default function AddCard() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const numericDeckId = deckId ? parseInt(deckId) : 0;
  const [deckName, setDeckName] = useState<string | null>(null);

  const { data: decksMap, isLoading } = useDeckNamesAndIds();

  useEffect(() => {
    if (decksMap && numericDeckId) {
      const foundDeckName = Object.keys(decksMap).find(key => decksMap[key] === numericDeckId);
      setDeckName(foundDeckName || null);
    }
  }, [decksMap, numericDeckId]);

  const handleNoteAdded = (noteId: number) => {
    toast({
      title: "笔记已添加",
      description: `成功创建笔记 #${noteId}`,
    });

    navigate(`/decks/${numericDeckId}`);
  };

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

  if (!deckName) {
    return (
      <RootLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">找不到牌组</h2>
          <p className="mt-2 text-muted-foreground">无法找到ID为 {deckId} 的牌组</p>
          <Button className="mt-4" asChild>
            <Link to="/decks">返回牌组列表</Link>
          </Button>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">添加卡片</h1>
          <p className="text-muted-foreground">添加新卡片到 {deckName} 牌组</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>创建新卡片</CardTitle>
            <CardDescription>
              填写以下表单创建新的 Anki 卡片
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoteEditor defaultDeckName={deckName} onSaved={handleNoteAdded} />
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}