export interface AnkiConnectRequest {
  action: string;
  version: number;
  params?: Record<string, any>;
}

export interface AnkiConnectResponse<T = unknown> {
  result: T;
  error: string | null;
}

export class AnkiConnectError extends Error {
  public readonly action: string;
  public readonly params?: Record<string, any>;
  public readonly originalError?: any;

  constructor(
    message: string,
    action: string,
    params?: Record<string, any>,
    originalError?: any
  ) {
    super(message);
    this.name = "AnkiConnectError";
    this.action = action;
    this.params = params;
    this.originalError = originalError;
  }
}

export const DEFAULT_ANKI_CONNECT_URL = "http://localhost:8765";

/**
 * 调用 AnkiConnect API
 * @param action API 动作名称
 * @param params 请求参数
 * @param ankiConnectUrl AnkiConnect 服务 URL（在中转模式下作为备用信息）
 * @returns API 响应结果
 * @throws {AnkiConnectError} 当 API 调用失败时
 */
export async function ankiConnectInvoke<T = unknown>(
  action: string,
  params: Record<string, any> = {},
  ankiConnectUrl: string = DEFAULT_ANKI_CONNECT_URL
): Promise<T> {
  const request: AnkiConnectRequest = {
    action,
    version: 6,
    params,
  };

  try {
    // 通过 Remix 后端 API 中转请求
    const response = await fetch("/api/anki-connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...request,
        ankiConnectUrl, // 传递 AnkiConnect URL 给后端
      }),
    });

    if (!response.ok) {
      throw new AnkiConnectError(
        `HTTP 错误: ${response.status} ${response.statusText}`,
        action,
        params
      );
    }

    const data = await response.json();

    // 检查后端转发的错误
    if (data.error) {
      throw new AnkiConnectError(
        `AnkiConnect 错误: ${data.error}`,
        action,
        params
      );
    }

    return data.result;
  } catch (error) {
    if (error instanceof AnkiConnectError) {
      throw error;
    }

    throw new AnkiConnectError(
      `调用 AnkiConnect 失败: ${error instanceof Error ? error.message : String(error)}`,
      action,
      params,
      error
    );
  }
}

/**
 * 测试与 AnkiConnect 的连接
 * @param ankiConnectUrl AnkiConnect 服务 URL
 * @returns 连接是否成功
 */
export async function testConnection(
  ankiConnectUrl: string = DEFAULT_ANKI_CONNECT_URL
): Promise<boolean> {
  try {
    const version = await ankiConnectInvoke<number>("version", {}, ankiConnectUrl);
    return version >= 6;
  } catch (error) {
    console.error("AnkiConnect 连接测试失败:", error);
    return false;
  }
}

/**
 * 获取 AnkiConnect 版本
 * @param ankiConnectUrl AnkiConnect 服务 URL
 * @returns 版本号
 */
export async function getVersion(
  ankiConnectUrl: string = DEFAULT_ANKI_CONNECT_URL
): Promise<number> {
  return await ankiConnectInvoke<number>("version", {}, ankiConnectUrl);
}
