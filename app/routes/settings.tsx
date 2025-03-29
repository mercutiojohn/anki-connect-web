import { useState, useEffect } from "react";
import { RootLayout } from "~/components/layout/root-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { useAnkiConnectStatus, useAnkiConnectVersion } from "~/lib/hooks/useAnkiConnect";
import { DEFAULT_ANKI_CONNECT_URL } from "~/lib/anki-connect/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { useTheme } from "remix-themes";
import { Label } from "~/components/ui/label";

export default function Settings() {
  const [customUrl, setCustomUrl] = useState<string>(
    typeof localStorage !== 'undefined' ? localStorage.getItem("ankiConnectUrl") || DEFAULT_ANKI_CONNECT_URL : DEFAULT_ANKI_CONNECT_URL
  );
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      setCustomUrl(localStorage.getItem("ankiConnectUrl") || DEFAULT_ANKI_CONNECT_URL);
    }
  }, []);

  const {
    data: isConnected,
    isLoading: isCheckingConnection,
    refetch: refetchConnection
  } = useAnkiConnectStatus(customUrl);

  const { data: version } = useAnkiConnectVersion(customUrl);

  const handleSaveUrl = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("ankiConnectUrl", customUrl);
    }
    refetchConnection();

    toast({
      title: "设置已保存",
      description: `AnkiConnect URL 已更新为: ${customUrl}`,
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await refetchConnection();
      setIsTesting(false);
    } catch (error) {
      setIsTesting(false);
    }
  };

  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">设置</h1>
          <p className="text-muted-foreground">管理应用程序设置和连接选项</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>AnkiConnect 连接</CardTitle>
              <CardDescription>
                配置与本地 Anki 实例的连接
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <div className="flex items-center gap-2">
                  {isCheckingConnection || isTesting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                  ) : isConnected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}

                  <div>
                    <p className="font-medium">
                      {isCheckingConnection || isTesting
                        ? "检查连接中..."
                        : isConnected
                          ? `已连接 (版本 ${version || "未知"})`
                          : "未连接到 Anki"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isConnected
                        ? "通过 AnkiConnect 与 Anki 通信正常"
                        : "请确保 Anki 已启动并安装了 AnkiConnect 插件"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>AnkiConnect URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="http://localhost:8765"
                  />
                  <Button onClick={handleSaveUrl}>保存</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  通常情况下，默认的 URL 应该能够正常工作。如果您修改了 AnkiConnect 的配置，请在此处更新 URL。
                </p>
                <Button variant="outline" onClick={handleTestConnection}>
                  {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  测试连接
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>
                自定义应用程序的外观
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>深色模式</Label>
                    <CardDescription>
                      切换应用程序的颜色主题
                    </CardDescription>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setTheme("light")}
                  >
                    亮色
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setTheme("dark")}
                  >
                    暗色
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setTheme("system")}
                  >
                    系统
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>关于</CardTitle>
              <CardDescription>
                应用程序信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Anki Connect Web</h3>
                <p className="text-sm text-muted-foreground">
                  版本 0.1.0 (Alpha)
                </p>
                <p className="text-sm text-muted-foreground">
                  一个基于 Web 的 Anki 客户端，使用 AnkiConnect API 与本地 Anki 实例进行通信。
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">依赖项</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Remix</li>
                  <li>React</li>
                  <li>Shadcn UI</li>
                  <li>Tailwind CSS</li>
                  <li>React Query</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
}
