import Image from "next/image";

function Banner({ text }: { text: string }) {
  return (
    <div className="hidden lg:flex bg-freehunt-beige-dark p-2.5 h-[200px] items-center justify-center">
      <p className="relative text-freehunt-black-two text-[40px] font-bold w-[476px] text-center">
        {text}
        <Image
          src="/assets/red-pointer.svg"
          alt=""
          className="absolute right-12 bottom-0"
          width={67}
          height={67}
          loading="eager"
        />
      </p>
    </div>
  );
}

export { Banner };
