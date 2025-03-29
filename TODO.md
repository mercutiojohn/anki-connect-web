# Anki Connect Web 应用实现 TODO 列表

## 第一阶段：基础设施和连接

### 1. 项目初始化 
- [x] 使用 Remix 创建项目基础结构
- [x] 配置 Tailwind CSS
- [x] 添加 Shadcn UI 组件库
- [ ] 设置 React Query

### 2. AnkiConnect API 客户端实现
- [ ] 创建 `app/lib/anki-connect/api.ts` 实现基础 API 调用函数
  - [ ] 实现 `ankiConnectInvoke` 函数
  - [ ] 实现 `testConnection` 函数
- [ ] 创建 API 错误处理机制
- [ ] 添加连接状态检测逻辑

### 3. 牌组 API 实现
- [ ] 创建 `app/lib/anki-connect/decks.ts`
  - [ ] 实现 `getDeckNames` 函数
  - [ ] 实现 `getDeckStats` 函数 
  - [ ] 实现 `createDeck` 函数
  - [ ] 实现 `deleteDeck` 函数

### 4. 卡片和笔记 API 实现
- [ ] 创建 `app/lib/anki-connect/cards.ts`
  - [ ] 实现 `findCards` 函数
  - [ ] 实现 `getCardsInfo` 函数
  - [ ] 实现 `suspendCard` / `unsuspendCard` 函数
- [ ] 创建 `app/lib/anki-connect/notes.ts`
  - [ ] 实现 `addNote` 函数
  - [ ] 实现 `updateNoteFields` 函数
  - [ ] 实现 `getNoteInfo` 函数

### 5. 模型 API 实现
- [ ] 创建 `app/lib/anki-connect/models.ts`
  - [ ] 实现 `getModelNames` 函数
  - [ ] 实现 `getModelFields` 函数

### 6. React Query 钩子
- [ ] 创建 `app/lib/hooks/useAnkiConnect.ts` 包含通用钩子
- [ ] 创建针对特定 API 的钩子函数

## 第二阶段：UI 组件和布局

### 7. 基本布局组件
- [ ] 创建 `app/components/layout/root-layout.tsx` 主布局组件
- [ ] 实现导航栏组件 `app/components/layout/navbar.tsx`
- [ ] 实现侧边栏组件 `app/components/layout/sidebar.tsx`
- [ ] 添加加载状态组件 `app/components/ui/loading.tsx`
- [ ] 添加错误显示组件 `app/components/ui/error-display.tsx`

### 8. Anki 特定组件
- [ ] 创建 `app/components/anki/deck-list.tsx` 牌组列表组件
- [ ] 创建 `app/components/anki/deck-stats.tsx` 牌组统计组件
- [ ] 创建 `app/components/anki/card-view.tsx` 卡片查看组件
- [ ] 创建 `app/components/anki/note-editor.tsx` 笔记编辑器组件

## 第三阶段：路由和页面实现

### 9. 首页和设置页面
- [ ] 实现 `app/routes/_index.tsx` 首页/仪表盘
- [ ] 实现 `app/routes/settings.tsx` 设置页面

### 10. 牌组相关页面
- [ ] 实现 `app/routes/decks/_index.tsx` 牌组列表页面
- [ ] 实现 `app/routes/decks/$deckName.tsx` 牌组详情页面
- [ ] 实现 `app/routes/decks/$deckName/review.tsx` 复习界面
- [ ] 实现 `app/routes/decks/$deckName/add.tsx` 添加卡片页面

### 11. 卡片相关页面
- [ ] 实现 `app/routes/cards/$cardId.tsx` 卡片详情/编辑页面

## 第四阶段：高级功能和优化

### 12. 媒体文件支持
- [ ] 创建 `app/lib/anki-connect/media.ts` 实现媒体文件 API
- [ ] 实现文件上传组件 `app/components/anki/media-uploader.tsx`
- [ ] 实现媒体预览组件 `app/components/anki/media-preview.tsx`

### 13. 高级搜索功能
- [ ] 实现高级搜索组件 `app/components/anki/advanced-search.tsx`
- [ ] 添加 Anki 查询语法支持

### 14. 离线功能和状态管理
- [ ] 实现连接状态管理
- [ ] 添加断连时的用户提示和重连机制
- [ ] 实现基本的离线缓存功能

### 15. 测试和优化
- [ ] 编写单元测试
- [ ] 进行性能优化
- [ ] 添加错误边界处理
- [ ] 改进用户体验

## 第五阶段：部署和发布

### 16. 文档和帮助
- [ ] 创建用户指南
- [ ] 添加应用内帮助提示
- [ ] 编写开发文档

### 17. 部署准备
- [ ] 优化构建过程
- [ ] 添加环境变量配置
- [ ] 测试不同平台兼容性

### 18. 发布
- [ ] Alpha 版本发布（基本功能）
- [ ] Beta 版本发布（完整功能）
- [ ] 1.0 正式版发布

## 参考和资源

- AnkiConnect API 文档：[README_anki_connect.md](https://foosoft.net/projects/anki-connect/)
- Remix 文档：[Remix Docs](https://remix.run/docs/en/main)
- Shadcn UI 组件：[Shadcn UI](https://ui.shadcn.com/)
- React Query 文档：[TanStack Query](https://tanstack.com/query/latest)
