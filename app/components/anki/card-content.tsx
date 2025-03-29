import { CardInfo } from "~/lib/anki-connect/cards";
import { Button } from "~/components/ui/button";
import { Card } from "../ui/card";

interface AnkiCardContentProps {
  cardInfo: CardInfo;
  showAnswer?: boolean;
  toggleAnswer?: () => void;
  showToggleButton?: boolean;
  className?: string;
}

export function AnkiCardContent({
  cardInfo,
  showAnswer = false,
  toggleAnswer,
  showToggleButton = true,
  className = "",
}: AnkiCardContentProps) {
  const content = showAnswer ? cardInfo.answer : cardInfo.question;

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">
          {showAnswer ? "答案" : "问题"}
        </h3>
        {showToggleButton && toggleAnswer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAnswer}
          >
            {showAnswer ? "显示问题" : "显示答案"}
          </Button>
        )}
      </div> */}
      <div
        className="card p-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Card>
  );
}