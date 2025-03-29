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
 * @param deckId 牌组ID
 * @returns 牌组统计信息
 */
export async function getDeckStats(deckId: number): Promise<DeckStats> {
  // 获取牌组名称和ID的映射
  const allDecks = await getDeckNamesAndIds();

  console.log("获取所有牌组名称和ID的映射:", allDecks);
  if (!allDecks) {
    throw new Error("无法获取牌组名称和ID的映射");
  }

  // 创建ID到名称的反向映射
  const idToNameMap: Record<number, string> = {};
  Object.entries(allDecks).forEach(([name, id]) => {
    idToNameMap[id] = name;
  });

  console.log("创建ID到名称的映射:", idToNameMap);

  const deckName = idToNameMap[deckId];

  if (!deckName) {
    throw new Error(`找不到ID为${deckId}的牌组`);
  }

  // 获取牌组状态
  type Result = {
    new_count: number;
    learn_count: number;
    review_count: number;
  }
  const statsResult = await ankiConnectInvoke<Record<string, Result>>("getDeckStats", {
    decks: [deckName]
  });

  console.log("获取牌组状态:", statsResult);

  if (!statsResult || !statsResult[deckId]) {
    throw new Error(`无法获取牌组"${deckName}"(ID:${deckId})的统计信息`);
  }

  const stats = statsResult[deckId];

  // 获取牌组中的卡片数量
  let totalCards = 0;
  try {
    const cardIds = await ankiConnectInvoke<number[]>("findCards", {
      query: `deck:"${deckName}"`
    });
    totalCards = cardIds?.length || 0;
  } catch (error) {
    console.error(`获取牌组 "${deckName}"(ID:${deckId}) 卡片总数时出错:`, error);
  }

  return {
    deck_id: deckId,
    name: deckName,
    new_count: stats.new_count || 0,
    learn_count: stats.learn_count || 0,
    review_count: stats.review_count || 0,
    total_in_deck: totalCards
  };
}

/**
 * 获取所有牌组的统计信息
 * @returns 所有牌组的统计信息数组
 */
export async function getAllDeckStats(): Promise<DeckStats[]> {
  // 使用getDeckNamesAndIds获取所有牌组名称和ID的映射
  const decksMap = await getDeckNamesAndIds();

  console.log("获取所有牌组名称和ID的映射:", decksMap);
  if (!decksMap) {
    throw new Error("无法获取牌组名称和ID的映射");
  }

  // 创建ID到名称的反向映射
  const idToNameMap: Record<number, string> = {};
  Object.entries(decksMap).forEach(([name, id]) => {
    idToNameMap[id] = name;
  });

  // 获取所有牌组的ID列表
  const deckIds = Object.values(decksMap);
  const deckNames = Object.keys(decksMap);

  // 获取所有牌组的状态信息
  const allStats = await ankiConnectInvoke<Record<string, {
    new_count: number;
    learn_count: number;
    review_count: number;
  }>>("getDeckStats", {
    decks: deckNames
  });

  console.log("获取所有牌组的状态信息:", allStats);
  if (!allStats) {
    throw new Error("无法获取所有牌组的状态信息");
  }

  // 为每个牌组ID获取卡片总数并构建最终结果
  const statsPromises = deckIds.map(async (deckId) => {
    const name = idToNameMap[deckId];
    console.log("处理牌组:", name, "ID:", deckId);

    // 添加错误处理，确保allStats[name]存在
    const deckStats = allStats[deckId] || { new_count: 0, learn_count: 0, review_count: 0 };

    // 获取卡片总数
    let totalCards = 0;
    try {
      const cardIds = await ankiConnectInvoke<number[]>("findCards", {
        query: `deck:"${name}"`
      });
      totalCards = cardIds?.length || 0;
    } catch (error) {
      console.error(`获取牌组 "${name}"(ID:${deckId}) 卡片总数时出错:`, error);
    }

    return {
      deck_id: deckId,
      name: name,
      new_count: deckStats.new_count || 0,
      learn_count: deckStats.learn_count || 0,
      review_count: deckStats.review_count || 0,
      total_in_deck: totalCards
    };
  });

  try {
    // 等待所有统计信息的 Promise 完成
    return await Promise.all(statsPromises);
  } catch (error) {
    console.error("获取牌组统计信息时出错:", error);
    throw error;
  }
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
