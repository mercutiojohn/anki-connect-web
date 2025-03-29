import { useState, useEffect } from "react";
import { useModelNames, useModelFieldNames, useAddNote, useNoteInfo, useUpdateNoteFields } from "~/lib/hooks/useAnkiConnect";
import { useDeckNames, useDeckNamesAndIds } from "~/lib/hooks/useAnkiConnect";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

interface NoteEditorProps {
  noteId?: number; // 如果提供则为编辑模式，否则为创建模式
  defaultDeckName?: string;
  onSaved?: (noteId: number) => void;
}

export function NoteEditor({ noteId, defaultDeckName, onSaved }: NoteEditorProps) {
  const { data: deckNamesAndIds, isLoading: decksLoading } = useDeckNamesAndIds();
  const deckNames = deckNamesAndIds ? Object.keys(deckNamesAndIds) : [];
  const { data: modelNames, isLoading: modelsLoading } = useModelNames();

  const [selectedDeck, setSelectedDeck] = useState<string>(defaultDeckName || "");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const { data: fieldNames, isLoading: fieldsLoading } = useModelFieldNames(selectedModel);
  const { data: noteInfo, isLoading: noteLoading } = useNoteInfo(noteId || 0);

  const addNoteMutation = useAddNote();
  const updateNoteFieldsMutation = useUpdateNoteFields();

  const isEditMode = !!noteId;
  const isLoading = decksLoading || modelsLoading || fieldsLoading || (isEditMode && noteLoading);

  // 定义表单模式
  const formSchema = z.object({
    fields: z.record(z.string()),
  });

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: {},
    },
  });

  // 载入笔记数据（编辑模式）
  useEffect(() => {
    if (isEditMode && noteInfo) {
      // 设置模型和牌组
      setSelectedModel(noteInfo.modelName);
      setTags(noteInfo.tags);

      // 设置字段值
      const fields: Record<string, string> = {};
      Object.entries(noteInfo.fields).forEach(([name, field]) => {
        fields[name] = field.value;
      });
      form.reset({ fields });
    }
  }, [isEditMode, noteInfo, form]);

  // 当选择的模型变化时，重置表单字段
  useEffect(() => {
    if (fieldNames && fieldNames.length > 0) {
      const emptyFields: Record<string, string> = {};
      fieldNames.forEach(field => {
        // 保留表单中已有的值
        emptyFields[field] = form.getValues().fields[field] || "";
      });
      form.setValue("fields", emptyFields);
    }
  }, [fieldNames, form]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode && noteId) {
        await updateNoteFieldsMutation.mutateAsync({
          noteId,
          fields: data.fields,
        });
      } else {
        if (!selectedDeck || !selectedModel) {
          return;
        }
        const newNoteId = await addNoteMutation.mutateAsync({
          deckName: selectedDeck,
          modelName: selectedModel,
          fields: data.fields,
          tags,
        });

        if (onSaved) {
          onSaved(newNoteId);
        }
      }
    } catch (error) {
      console.error("笔记保存失败:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? "编辑笔记" : "添加新笔记"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!isEditMode && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>牌组</FormLabel>
                    <Select
                      value={selectedDeck}
                      onValueChange={setSelectedDeck}
                      disabled={isEditMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择牌组" />
                      </SelectTrigger>
                      <SelectContent>
                        {deckNames?.map(name => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>选择添加笔记的牌组</FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>模型</FormLabel>
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={isEditMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelNames?.map(name => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>选择卡片模型</FormDescription>
                  </FormItem>
                </div>
              </>
            )}

            {/* 模型字段 */}
            {selectedModel && fieldNames && fieldNames.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">填写字段</h3>

                {fieldNames.map(fieldName => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={`fields.${fieldName}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldName}</FormLabel>
                        {fieldName.toLowerCase().includes("back") ||
                          fieldName.toLowerCase().includes("answer") ||
                          fieldName.toLowerCase().includes("解析") ? (
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                        ) : (
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* 标签 */}
            <div className="space-y-2">
              <FormLabel>标签</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="输入标签"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " " || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag}>添加</Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                addNoteMutation.isPending ||
                updateNoteFieldsMutation.isPending ||
                (!isEditMode && (!selectedDeck || !selectedModel))
              }
            >
              {(addNoteMutation.isPending || updateNoteFieldsMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isEditMode ? "保存更改" : "添加笔记"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
