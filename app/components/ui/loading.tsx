import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({ text = "加载中...", size = "md" }: LoadingProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeMap[size]} animate-spin mr-2`} />
      <span>{text}</span>
    </div>
  );
}
