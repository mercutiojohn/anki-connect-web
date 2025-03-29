import { AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

interface ErrorDisplayProps {
  title?: string;
  error: Error | string | unknown;
  retry?: () => void;
}

export function ErrorDisplay({
  title = "发生错误",
  error,
  retry
}: ErrorDisplayProps) {
  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : "未知错误";

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          {errorMessage}
        </div>
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            className="mt-4"
          >
            重试
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
