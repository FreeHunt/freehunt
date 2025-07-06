interface TipBoxProps {
  content: string;
}

export function TipBox({ content }: TipBoxProps) {
  return (
    <div className="flex p-5 flex-col items-start gap-3 self-stretch border border-border rounded-lg bg-muted/50 w-full max-md:hidden">
      <p className="text-foreground text-sm font-medium">Astuce</p>
      <p className="text-muted-foreground text-sm font-normal">{content}</p>
    </div>
  );
}
