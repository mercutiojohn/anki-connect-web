import { ankiConnectInvoke } from "./api";

export interface DeckStats {
  deck_id: number;
  name: string;
  new_count: number;
  learn_count: number;
  review_count: number;
  total_in_deck: number;
}

export interface DeckTreeNode {
  name: string;
  deck_id: number;
  collapsed: boolean;
  level: number;
  children: DeckTreeNode[];
  // 扩展的状态数据
  new_count?: number;
  learn_count?: number;
  review_count?: number;
  total_in_deck?: number;
}

// 新增的类型：牌组名称及ID的映射对象
export interface DeckNamesAndIds {
  [name: string]: number;
}

/**
 * 获取所有牌组名称
 * @returns 牌组名称数组
 */
export async function getDeckNames(): Promise<string[]> {
  return await ankiConnectInvoke<string[]>("deckNames");
}

/**
 * 获取所有牌组名称及其ID
 * @returns 牌组名称到ID的映射对象
 */
export async function getDeckNamesAndIds(): Promise<DeckNamesAndIds> {
  return await ankiConnectInvoke<DeckNamesAndIds>("deckNamesAndIds");
}

/**
 * 获取牌组统计信息
 * @param deckName 牌组名称
 * @returns 牌组统计信息
 */
export async function getDeckStats(deckName: string): Promise<DeckStats> {
  // 获取牌组 ID
  const deckId = await ankiConnectInvoke<number>("getDeckId", {
    deck: deckName
  });

  // 获取牌组状态
  const stats = await ankiConnectInvoke<{
    new_count: number;
    learn_count: number;
    review_count: number;
  }>("getDeckStats", {
    decks: [deckName]
  });

  // 获取牌组中的卡片数量
  const totalCards = await ankiConnectInvoke<number>("findCards", {
    query: `deck:"${deckName}"`
  }).then(cardIds => cardIds.length);

  return {
    deck_id: deckId,
    name: deckName,
    new_count: stats.new_count,
    learn_count: stats.learn_count,
    review_count: stats.review_count,
    total_in_deck: totalCards
  };
}

/**
 * 获取所有牌组的统计信息
 * @returns 所有牌组的统计信息数组
 */
export async function getAllDeckStats(): Promise<DeckStats[]> {
  const deckNames = await getDeckNames();
  const statsPromises = deckNames.map(name => getDeckStats(name));
  return await Promise.all(statsPromises);
}

/**
 * 创建新牌组
 * @param deckName 牌组名称
 * @returns 新牌组的 ID
 */
export async function createDeck(deckName: string): Promise<number> {
  return await ankiConnectInvoke<number>("createDeck", {
    deck: deckName
  });
}

/**
 * 删除牌组
 * @param deckName 要删除的牌组名称
 * @returns 操作是否成功
 */
export async function deleteDeck(deckName: string): Promise<boolean> {
  await ankiConnectInvoke("deleteDecks", {
    decks: [deckName],
    cardsToo: true
  });

  return true;
}

/**
 * 获取牌组树结构
 * @returns 牌组树结构
 */
export async function getDeckTree(): Promise<DeckTreeNode[]> {
  return await ankiConnectInvoke<DeckTreeNode[]>("getDeckConfig");
}
