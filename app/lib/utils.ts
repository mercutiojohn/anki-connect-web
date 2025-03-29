import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 安全地对字符串进行 URL 编码
 * 主要用于牌组名称等包含特殊字符的字段
 */
export function safeUrlEncode(str: string | undefined | null): string {
  if (!str) return "";
  // console.log("原始字符串:", str);
  return encodeURIComponent(str);
}
