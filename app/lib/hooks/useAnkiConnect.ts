import { useMutation, useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import { testConnection, getVersion } from "../anki-connect/api";
import {
  getDeckNames, getDeckStats, getAllDeckStats, getDeckNamesAndIds,
  createDeck, deleteDeck, DeckStats
} from "../anki-connect/decks";
import {
  findCards, getCardsInfo, getCardInfo,
  suspendCards, unsuspendCards, CardInfo
} from "../anki-connect/cards";
import {
  addNote, updateNoteFields, getNoteInfo,
  deleteNotes, NoteAddParams, NoteInfo
} from "../anki-connect/notes";
import {
  getModelNames, getModelFieldNames, getModelFields,
  getModelTemplates, getModelInfo
} from "../anki-connect/models";

// 键名常量
export const queryKeys = {
  connection: ["anki-connection"],
  version: ["anki-version"],
  decks: {
    all: ["decks"],
    allWithIds: ["decks", "with-ids"],
    stats: ["decks", "stats"],
    detail: (deckId: number) => ["decks", "id", deckId],
  },
  cards: {
    all: ["cards"],
    byId: (cardId: number) => ["cards", cardId],
    byQuery: (query: string) => ["cards", "query", query],
  },
  notes: {
    all: ["notes"],
    byId: (noteId: number) => ["notes", noteId],
  },
  models: {
    all: ["models"],
    byName: (modelName: string) => ["models", modelName],
    fields: (modelName: string) => ["models", modelName, "fields"],
    templates: (modelName: string) => ["models", modelName, "templates"],
  },
};

// 连接相关钩子
export function useAnkiConnectStatus(url?: string) {
  return useQuery({
    queryKey: queryKeys.connection,
    queryFn: () => testConnection(url),
    staleTime: 30000, // 30秒内不重新请求
    refetchInterval: 60000, // 每 60 秒自动重新检查
  });
}

export function useAnkiConnectVersion(url?: string) {
  return useQuery({
    queryKey: queryKeys.version,
    queryFn: () => getVersion(url),
    staleTime: 3600000, // 1小时内不重新请求
  });
}

// 牌组相关钩子
export function useDeckNames() {
  return useQuery({
    queryKey: queryKeys.decks.all,
    queryFn: getDeckNames,
    staleTime: 30000, // 30秒内不重新请求
  });
}

export function useDeckNamesAndIds() {
  return useQuery({
    queryKey: queryKeys.decks.allWithIds,
    queryFn: getDeckNamesAndIds,
    staleTime: 30000, // 30秒内不重新请求
  });
}

export function useDeckStats(deckId: number) {
  return useQuery({
    queryKey: queryKeys.decks.detail(deckId),
    queryFn: () => getDeckStats(deckId),
    enabled: !!deckId,
  });
}

export function useAllDeckStats() {
  return useQuery({
    queryKey: queryKeys.decks.stats,
    queryFn: getAllDeckStats,
    staleTime: 30000, // 30秒内不重新请求
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeck,
    onSuccess: (_data, deckName) => {
      // 创建牌组成功后，更新牌组列表和统计信息缓存
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.stats });
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: (_data, deckName) => {
      // 删除牌组成功后，更新牌组列表和统计信息缓存
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.detail(deckName) });
    },
  });
}

// 卡片相关钩子
export function useCardsByQuery(query: string) {
  return useQuery({
    queryKey: queryKeys.cards.byQuery(query),
    queryFn: () => findCards(query),
    enabled: !!query,
  });
}

export function useCardInfo(cardId: number) {
  return useQuery({
    queryKey: queryKeys.cards.byId(cardId),
    queryFn: () => getCardInfo(cardId),
    enabled: !!cardId,
  });
}

export function useCardsInfo(cardIds: number[]) {
  return useQuery({
    queryKey: [...queryKeys.cards.all, cardIds],
    queryFn: () => getCardsInfo(cardIds),
    enabled: cardIds.length > 0,
  });
}

export function useSuspendCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendCard,
    onSuccess: (_data, cardId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.byId(cardId) });
    },
  });
}

export function useUnsuspendCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsuspendCard,
    onSuccess: (_data, cardId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.byId(cardId) });
    },
  });
}

// 笔记相关钩子
export function useNoteInfo(noteId: number) {
  return useQuery({
    queryKey: queryKeys.notes.byId(noteId),
    queryFn: () => getNoteInfo(noteId),
    enabled: !!noteId,
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNote,
    onSuccess: (_data, params) => {
      // 添加笔记成功后，更新相关牌组的数据
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.detail(params.deckName) });
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.stats });
    },
  });
}

export function useUpdateNoteFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, fields }: { noteId: number; fields: Record<string, string> }) =>
      updateNoteFields(noteId, fields),
    onSuccess: (_data, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byId(noteId) });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // 删除笔记可能影响多个牌组，所以我们刷新所有牌组统计
      queryClient.invalidateQueries({ queryKey: queryKeys.decks.stats });
    },
  });
}

// 模型相关钩子
export function useModelNames() {
  return useQuery({
    queryKey: queryKeys.models.all,
    queryFn: getModelNames,
    staleTime: 3600000, // 1小时内不重新请求，因为模型不常变化
  });
}

export function useModelFieldNames(modelName: string) {
  return useQuery({
    queryKey: queryKeys.models.fields(modelName),
    queryFn: () => getModelFieldNames(modelName),
    enabled: !!modelName,
    staleTime: 3600000, // 1小时内不重新请求
  });
}

export function useModelInfo(modelName: string) {
  return useQuery({
    queryKey: queryKeys.models.byName(modelName),
    queryFn: () => getModelInfo(modelName),
    enabled: !!modelName,
    staleTime: 3600000, // 1小时内不重新请求
  });
}
