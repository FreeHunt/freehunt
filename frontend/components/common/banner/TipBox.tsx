interface TipBoxProps {
  content: string;
}

export function TipBox({ content }: TipBoxProps) {
  return (
    <div className="flex p-5 flex-col items-start gap-3 self-stretch border border-freehunt-black-two rounded-lg bg-[#FCF9F5] w-full">
      <p className="text-freehunt-black-two text-sm font-bold">Astuce</p>
      <p className="text-freehunt-black-two text-sm font-normal">{content}</p>
    </div>
  );
}
