import { cn } from "@lib/utils";
import { AlertCircleIcon } from "lucide-react";

type Props = {
  className?: string;
  title: string;
  description: string;
};

export default function Alert({ title, description, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border border-hairline bg-canvas-soft p-3 leading-normal",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <AlertCircleIcon className="size-4 shrink-0 text-muted" />
        <span className="title-sm text-ink">{title}</span>
      </div>
      <p className="caption ml-6 text-body">{description}</p>
    </div>
  );
}
