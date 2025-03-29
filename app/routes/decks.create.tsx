import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { RootLayout } from "~/components/layout/root-layout";
import { useCreateDeck } from "~/lib/hooks/useAnkiConnect";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  deckName: z.string().min(1, "牌组名称不能为空").max(100),
});

export default function CreateDeck() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createDeckMutation = useCreateDeck();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createDeckMutation.mutateAsync(data.deckName);
      toast({
        title: "牌组创建成功",
        description: `已创建牌组：${data.deckName}`,
      });
      navigate(`/decks/${encodeURIComponent(data.deckName)}`);
    } catch (error) {
      toast({
        title: "创建牌组失败",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">创建新牌组</h1>
          <p className="text-muted-foreground">创建一个新的 Anki 牌组</p>
        </div>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>牌组信息</CardTitle>
            <CardDescription>
              请输入新牌组的名称。牌组名可以包含层级结构，如"英语::词汇"。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="deckName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>牌组名称</FormLabel>
                      <FormControl>
                        <Input placeholder="输入牌组名称" {...field} />
                      </FormControl>
                      <FormDescription>
                        使用"::"创建子牌组，例如"语言::英语"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createDeckMutation.isPending}
                  >
                    {createDeckMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    创建牌组
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/decks")}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}