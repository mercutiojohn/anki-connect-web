# Anki Connect Web 应用实施计划

## 项目概述

创建一个基于 Web 的 Anki 客户端，使用 AnkiConnect API 与本地 Anki 实例进行通信。该应用将提供卡片查看、添加、编辑和复习等功能。

## 技术栈

- **框架**：Remix
- **UI 库**：React + Shadcn UI
- **数据获取**：React Query
- **路由**：React Router (通过 Remix 内置)
- **样式**：Tailwind CSS

## 目录结构

我们将基于现有的工作区目录结构构建应用：

```
app/
  components/ - UI 组件
    ui/ - 已有的 Shadcn UI 组件
    anki/ - Anki 特定组件
      card-view.tsx
      deck-list.tsx
      note-editor.tsx
      etc...
  lib/ - 工具函数和钩子
    anki-connect/ - AnkiConnect API 相关函数
      api.ts - API 基础功能
      decks.ts - 与牌组相关的操作
      cards.ts - 与卡片相关的操作
      notes.ts - 与笔记相关的操作
      etc...
    utils.ts - 已有的工具函数
  routes/ - Remix 路由
    _index.tsx - 首页/仪表盘
    decks/
      _index.tsx - 牌组列表
      $deckName.tsx - 特定牌组详情
      $deckName/
        review.tsx - 复习界面
        add.tsx - 添加卡片
    cards/
      $cardId.tsx - 卡片详情/编辑
    settings.tsx - 设置页面
```

## 开发阶段

### 第一阶段：基础设施和连接

1. **创建 AnkiConnect API 客户端**
   - 实现与 AnkiConnect API 通信的基础函数
   - 创建数据获取钩子
   - 添加错误处理和连接状态检测

2. **实现基本布局**
   - 创建主布局组件
   - 实现导航栏和侧边栏
   - 添加亮/暗模式切换

### 第二阶段：核心功能

3. **牌组管理**
   - 显示用户牌组列表
   - 实现牌组创建/删除功能
   - 显示牌组统计信息

4. **卡片管理**
   - 实现卡片浏览功能
   - 添加卡片搜索/过滤功能
   - 创建卡片编辑界面

5. **学习和复习**
   - 实现卡片复习界面
   - 添加答案评分功能
   - 支持显示问题/答案切换

### 第三阶段：增强功能

6. **媒体文件支持**
   - 实现图像和音频文件上传
   - 添加媒体文件预览功能

7. **高级搜索和过滤**
   - 创建高级搜索界面
   - 支持 Anki 查询语法

8. **用户设置**
   - 创建设置界面
   - 添加偏好设置和本地存储

## API 实现计划

我们将根据 AnkiConnect 文档实现以下主要 API 函数：

### 基础功能
- `ankiConnectInvoke` - 基础 API 调用函数
- `testConnection` - 测试 AnkiConnect 连接

### 牌组操作
- `getDeckNames` - 获取所有牌组名称
- `getDeckStats` - 获取牌组统计信息
- `createDeck` - 创建新牌组
- `deleteDeck` - 删除牌组

### 卡片操作
- `findCards` - 搜索卡片
- `getCardsInfo` - 获取卡片详细信息
- `suspendCard` / `unsuspendCard` - 暂停/取消暂停卡片

### 笔记操作
- `addNote` - 添加笔记
- `updateNoteFields` - 更新笔记字段
- `getNoteInfo` - 获取笔记信息

### 模型操作
- `getModelNames` - 获取所有模型名称
- `getModelFields` - 获取模型字段

### 学习操作
- `guiDeckReview` - 开始牌组复习
- `guiAnswerCard` - 回答当前卡片

## 页面和路由设计

### 首页 (`/`)
- 显示概览统计
- 快速访问常用牌组
- 显示今日学习任务

### 牌组页面 (`/decks`)
- 列出所有牌组
- 每个牌组显示基本统计信息
- 提供创建新牌组的功能

### 牌组详情 (`/decks/:deckName`)
- 显示牌组详细统计信息
- 列出牌组中的卡片
- 提供学习/复习按钮

### 复习页面 (`/decks/:deckName/review`)
- 卡片复习界面
- 问题/答案显示
- 评分按钮

### 添加卡片 (`/decks/:deckName/add`)
- 表单用于创建新卡片
- 字段编辑器
- 标签选择器

### 卡片详情 (`/cards/:cardId`)
- 显示卡片完整信息
- 提供编辑功能
- 显示复习历史

### 设置 (`/settings`)
- AnkiConnect 连接配置
- UI 首选项
- 其他应用设置

## 发布计划

1. **Alpha 版**：基本连接和牌组查看功能
2. **Beta 版**：完整的卡片管理和基本复习功能
3. **1.0 版**：全功能发布，包括媒体支持和高级搜索

## 注意事项

- 确保 AnkiConnect 插件已在用户的 Anki 中正确安装和配置
- 处理跨域请求问题（可能需要 CORS 配置）
- 提供清晰的错误消息，帮助用户诊断连接问题
- 考虑在本地 Anki 不可用时的离线模式或备用方案
- 注意 Anki 插件 API 可能的版本变更