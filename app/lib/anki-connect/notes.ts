import { ankiConnectInvoke } from "./api";

export interface NoteInfo {
  noteId: number;
  modelName: string;
  tags: string[];
  fields: Record<string, { value: string; order: number }>;
}

export interface NoteAddParams {
  deckName: string;
  modelName: string;
  fields: Record<string, string>;
  tags?: string[];
  options?: {
    allowDuplicate?: boolean;
    duplicateScope?: string;
    duplicateScopeOptions?: {
      deckName?: string;
      checkChildren?: boolean;
      checkAllModels?: boolean;
    };
  };
}

/**
 * 添加笔记
 * @param params 笔记参数
 * @returns 新笔记的 ID
 */
export async function addNote(params: NoteAddParams): Promise<number> {
  const { deckName, modelName, fields, tags = [], options = {} } = params;

  return await ankiConnectInvoke<number>("addNote", {
    note: {
      deckName,
      modelName,
      fields,
      tags,
      options
    }
  });
}

/**
 * 添加多个笔记
 * @param notes 笔记参数数组
 * @returns 添加的笔记 ID 数组，失败的位置为 null
 */
export async function addNotes(notes: NoteAddParams[]): Promise<(number | null)[]> {
  const formattedNotes = notes.map(({ deckName, modelName, fields, tags = [], options = {} }) => ({
    deckName,
    modelName,
    fields,
    tags,
    options
  }));

  return await ankiConnectInvoke<(number | null)[]>("addNotes", {
    notes: formattedNotes
  });
}

/**
 * 获取笔记信息
 * @param noteIds 笔记 ID 数组
 * @returns 笔记信息数组
 */
export async function getNotesInfo(noteIds: number[]): Promise<NoteInfo[]> {
  return await ankiConnectInvoke<NoteInfo[]>("notesInfo", {
    notes: noteIds
  });
}

/**
 * 获取单个笔记信息
 * @param noteId 笔记 ID
 * @returns 笔记信息
 */
export async function getNoteInfo(noteId: number): Promise<NoteInfo> {
  const notesInfo = await getNotesInfo([noteId]);
  if (!notesInfo.length) {
    throw new Error(`未找到 ID 为 ${noteId} 的笔记`);
  }
  return notesInfo[0];
}

/**
 * 更新笔记字段
 * @param noteId 笔记 ID
 * @param fields 要更新的字段
 */
export async function updateNoteFields(noteId: number, fields: Record<string, string>): Promise<void> {
  await ankiConnectInvoke("updateNoteFields", {
    note: {
      id: noteId,
      fields
    }
  });
}

/**
 * 删除笔记
 * @param noteIds 要删除的笔记 ID 数组
 */
export async function deleteNotes(noteIds: number[]): Promise<void> {
  await ankiConnectInvoke("deleteNotes", {
    notes: noteIds
  });
}

/**
 * 删除单个笔记
 * @param noteId 要删除的笔记 ID
 */
export async function deleteNote(noteId: number): Promise<void> {
  await deleteNotes([noteId]);
}

/**
 * 添加标签到笔记
 * @param noteIds 笔记 ID 数组
 * @param tags 要添加的标签数组
 */
export async function addTags(noteIds: number[], tags: string[]): Promise<void> {
  await ankiConnectInvoke("addTags", {
    notes: noteIds,
    tags: tags.join(" ")
  });
}

/**
 * 从笔记中移除标签
 * @param noteIds 笔记 ID 数组
 * @param tags 要移除的标签数组
 */
export async function removeTags(noteIds: number[], tags: string[]): Promise<void> {
  await ankiConnectInvoke("removeTags", {
    notes: noteIds,
    tags: tags.join(" ")
  });
}
