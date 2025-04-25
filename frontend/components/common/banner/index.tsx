import { RedPointer } from "../red-pointer";

function Banner({ text }: { text: string }) {
  return (
    <div className="hidden lg:flex bg-freehunt-beige-dark p-2.5 h-[200px] items-center justify-center">
      <p className="relative text-freehunt-black-two text-[40px] font-bold w-[476px] text-center">
        {text}
        <RedPointer />
      </p>
    </div>
  );
}

export { Banner };
