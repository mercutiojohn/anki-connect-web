import { ankiConnectInvoke } from "./api";

export interface ModelField {
  name: string;
  ord: number;
  sticky: boolean;
  rtl: boolean;
  font: string;
  size: number;
  description: string;
}

export interface ModelTemplate {
  name: string;
  ord: number;
  qfmt: string;
  afmt: string;
  bqfmt: string;
  bafmt: string;
  did: null | number;
  bfont: string;
  bsize: number;
}

export interface ModelInfo {
  modelName: string;
  fields: ModelField[];
  templates: ModelTemplate[];
  css: string;
}

/**
 * 获取所有模型名称
 * @returns 模型名称数组
 */
export async function getModelNames(): Promise<string[]> {
  return await ankiConnectInvoke<string[]>("modelNames");
}

/**
 * 获取模型字段
 * @param modelName 模型名称
 * @returns 模型字段名数组
 */
export async function getModelFieldNames(modelName: string): Promise<string[]> {
  return await ankiConnectInvoke<string[]>("modelFieldNames", {
    modelName
  });
}

/**
 * 获取模型字段详细信息
 * @param modelName 模型名称
 * @returns 字段详细信息
 */
export async function getModelFields(modelName: string): Promise<ModelField[]> {
  const modelInfo = await ankiConnectInvoke<ModelInfo>("modelFieldsOnTemplates", {
    modelName
  });
  return modelInfo.fields;
}

/**
 * 获取模型模板
 * @param modelName 模型名称
 * @returns 模板信息
 */
export async function getModelTemplates(modelName: string): Promise<ModelTemplate[]> {
  const modelInfo = await ankiConnectInvoke<ModelInfo>("modelFieldsOnTemplates", {
    modelName
  });
  return modelInfo.templates;
}

/**
 * 获取模型完整信息
 * @param modelName 模型名称
 * @returns 模型完整信息
 */
export async function getModelInfo(modelName: string): Promise<ModelInfo> {
  return await ankiConnectInvoke<ModelInfo>("modelFieldsOnTemplates", {
    modelName
  });
}

/**
 * 创建模型
 * @param modelName 模型名称
 * @param fields 字段数组
 * @param templates 模板数组
 * @param css CSS 样式
 * @returns 操作是否成功
 */
export async function createModel(
  modelName: string,
  fields: string[],
  templates: Record<string, { qfmt: string; afmt: string }>,
  css: string
): Promise<boolean> {
  await ankiConnectInvoke("createModel", {
    modelName,
    inOrderFields: fields,
    css,
    cardTemplates: templates,
  });

  return true;
}
