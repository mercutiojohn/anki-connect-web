import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";

interface CardGridProps<T> {
  columns: {
    accessorKey?: string;
    id?: string;
    header: string;
    cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
  }[];
  data: T[];
  pageSize?: number;
  renderTitle?: (item: T) => React.ReactNode;
  renderContent?: (item: T) => React.ReactNode;
  renderFooter?: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void; // 添加卡片点击事件处理函数
  showTitle?: boolean;
}

export function CardGrid<T>({
  columns,
  data,
  pageSize = 6,
  renderTitle,
  renderContent,
  renderFooter,
  onCardClick,
  showTitle = true,
}: CardGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);

  // 获取当前页的数据
  const currentData = data.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // 处理翻页
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // 默认标题渲染函数
  const defaultRenderTitle = (item: T) => {
    const titleColumn = columns.find(col => col.header === "问题" || col.accessorKey === "question");
    if (titleColumn && titleColumn.cell) {
      return titleColumn.cell({ row: { original: item } });
    } else if (titleColumn && titleColumn.accessorKey && item[titleColumn.accessorKey as keyof T]) {
      return String(item[titleColumn.accessorKey as keyof T]);
    }
    return "无标题";
  };

  // 默认内容渲染函数
  const defaultRenderContent = (item: T) => {
    const contentColumns = columns.filter(col =>
      col.id !== "actions" &&
      col.header !== "问题" &&
      col.accessorKey !== "question"
    );

    return (
      <div className="space-y-2">
        {contentColumns.map((column, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{column.header}</span>
            <div>
              {column.cell
                ? column.cell({ row: { original: item } })
                : column.accessorKey
                  ? String(item[column.accessorKey as keyof T] || '')
                  : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 默认底部渲染函数
  const defaultRenderFooter = (item: T) => {
    const actionsColumn = columns.find(col => col.id === "actions");
    if (actionsColumn && actionsColumn.cell) {
      return actionsColumn.cell({ row: { original: item } });
    }
    return null;
  };

  // 使用提供的渲染函数或默认函数
  const titleRenderer = renderTitle || defaultRenderTitle;
  const contentRenderer = renderContent || defaultRenderContent;
  const footerRenderer = renderFooter || defaultRenderFooter;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentData.map((item, index) => (
          <Card
            key={index}
            className={cn(
              `h-full flex flex-col`,
              `${onCardClick ? 'hover:border-primary/50 transition-colors' : ''}`)}
          >
            {showTitle &&
              <CardHeader>
                <CardTitle className="text-lg">{titleRenderer(item)}</CardTitle>
              </CardHeader>
            }
            <CardContent className={cn(
              "flex-grow",
              showTitle ? "" : "pt-6",
              ` ${onCardClick ? 'cursor-pointer' : ''}`
            )}
              onClick={onCardClick ? () => onCardClick(item) : undefined}
            >
              {contentRenderer(item)}
            </CardContent>
            <CardFooter className="border-t pt-3">
              <div className="flex justify-end w-full">
                {footerRenderer(item)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {currentPage + 1} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            下一页
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}