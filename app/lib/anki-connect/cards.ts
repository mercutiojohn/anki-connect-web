import { ankiConnectInvoke } from "./api";

export interface CardInfo {
  answer: string;
  question: string;
  deckName: string;
  modelName: string;
  fieldOrder: number;
  fields: Record<string, { value: string; order: number }>;
  css: string;
  cardId: number;
  interval: number;
  note: number;
  ord: number;
  type: number;
  queue: number;
  due: number;
  reps: number;
  lapses: number;
  left: number;
  mod: number;
}

/**
 * 查找卡片
 * @param query Anki 查询字符串
 * @returns 匹配的卡片 ID 数组
 */
export async function findCards(query: string): Promise<number[]> {
  return await ankiConnectInvoke<number[]>("findCards", {
    query
  });
}

/**
 * 获取卡片信息
 * @param cardIds 卡片 ID 数组
 * @returns 卡片信息数组
 */
export async function getCardsInfo(cardIds: number[]): Promise<CardInfo[]> {
  return await ankiConnectInvoke<CardInfo[]>("cardsInfo", {
    cards: cardIds
  });
}

/**
 * 获取单张卡片信息
 * @param cardId 卡片 ID
 * @returns 卡片信息
 */
export async function getCardInfo(cardId: number): Promise<CardInfo> {
  const cardsInfo = await getCardsInfo([cardId]);
  if (!cardsInfo.length) {
    throw new Error(`未找到 ID 为 ${cardId} 的卡片`);
  }
  return cardsInfo[0];
}

/**
 * 暂停卡片
 * @param cardIds 要暂停的卡片 ID 数组
 */
export async function suspendCards(cardIds: number[]): Promise<void> {
  await ankiConnectInvoke("suspend", {
    cards: cardIds
  });
}

/**
 * 取消暂停卡片
 * @param cardIds 要取消暂停的卡片 ID 数组
 */
export async function unsuspendCards(cardIds: number[]): Promise<void> {
  await ankiConnectInvoke("unsuspend", {
    cards: cardIds
  });
}

/**
 * 暂停单张卡片
 * @param cardId 卡片 ID
 */
export async function suspendCard(cardId: number): Promise<void> {
  await suspendCards([cardId]);
}

/**
 * 取消暂停单张卡片
 * @param cardId 卡片 ID
 */
export async function unsuspendCard(cardId: number): Promise<void> {
  await unsuspendCards([cardId]);
}

/**
 * 获取卡片的 HTML 渲染结果
 * @param cardId 卡片 ID
 * @returns 包含问题和答案 HTML 的对象
 */
export async function getCardRenderInfo(cardId: number): Promise<{ question: string; answer: string }> {
  const cardInfo = await getCardInfo(cardId);
  return {
    question: cardInfo.question,
    answer: cardInfo.answer
  };
}
