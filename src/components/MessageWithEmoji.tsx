import { cn } from "@misc/tools";

export const MessageWithEmoji = (props: {
  message: string;
  emoji: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-1", props.className)}>
      <span className="text-[32px]">{props.emoji}</span>
      <span className="text-base">{props.message}</span>
    </div>
  );
};
