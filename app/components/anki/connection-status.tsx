import { useState } from "react";
import { useAnkiConnectStatus, useAnkiConnectVersion } from "~/lib/hooks/useAnkiConnect";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function ConnectionStatus() {
  const [customUrl, setCustomUrl] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const {
    data: isConnected,
    isLoading: isCheckingConnection,
    refetch: refetchConnection
  } = useAnkiConnectStatus(customUrl);

  const { data: version } = useAnkiConnectVersion(customUrl);

  const handleUrlChange = () => {
    setCustomUrl(inputUrl || undefined);
    setIsEditing(false);
    refetchConnection();
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="http://localhost:8765"
            className="w-64"
          />
          <Button size="sm" onClick={handleUrlChange}>保存</Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>取消</Button>
        </div>
      ) : (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  {isCheckingConnection ? (
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                  ) : isConnected ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}

                  <span>
                    {isCheckingConnection
                      ? "检查 Anki 连接..."
                      : isConnected
                        ? `已连接${version ? ` (v${version})` : ''}`
                        : "未连接到 Anki"
                    }
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {customUrl || "使用默认 URL: http://localhost:8765"}
                <br />
                点击修改连接 URL
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-6 px-2"
          >
            修改
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchConnection()}
            className="h-6 px-2"
          >
            重连
          </Button>
        </>
      )}
    </div>
  );
}
