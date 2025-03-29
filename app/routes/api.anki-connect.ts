import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { AnkiConnectRequest, AnkiConnectResponse } from "~/lib/anki-connect/api";

/**
 * Anki Connect API 资源路由
 * 作为前端与 Anki 的中转层
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "只支持 POST 请求" }, { status: 405 });
  }

  try {
    const requestData = await request.json();
    const { action, version, params, ankiConnectUrl = "http://localhost:8765" } = requestData;

    // 记录请求信息，便于调试
    console.log(`[AnkiConnect] 调用操作: ${action}`, { params });

    // 构造发送给 AnkiConnect 的请求
    const ankiRequest: AnkiConnectRequest = {
      action,
      version,
      params,
    };

    // 调用真实的 AnkiConnect API
    const response = await fetch(ankiConnectUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ankiRequest),
    });

    if (!response.ok) {
      console.error(`[AnkiConnect] HTTP 错误: ${response.status} ${response.statusText}`);
      return json({
        result: null,
        error: `HTTP 错误: ${response.status} ${response.statusText}`,
      }, { status: 200 }); // 返回状态码 200 但包含错误信息，与 AnkiConnect 原始格式保持一致
    }

    // 返回 AnkiConnect 的响应
    const ankiResponse: AnkiConnectResponse = await response.json();
    return json(ankiResponse);
  } catch (error) {
    console.error("[AnkiConnect] 中转请求错误:", error);
    return json({
      result: null,
      error: `服务器错误: ${error instanceof Error ? error.message : String(error)}`,
    }, { status: 200 }); // 保持与 AnkiConnect 原始响应格式一致
  }
};

/**
 * 处理预检请求和其他 HTTP 方法
 */
export const loader = async () => {
  return json({
    error: "AnkiConnect API 只支持 POST 请求",
    result: null
  }, { status: 405 });
};