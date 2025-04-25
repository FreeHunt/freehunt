import Image from "next/image";
import { cn } from "@/lib/utils";

function RedPointer({
  width = 67,
  height = 67,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/assets/red-pointer.svg"
      alt=""
      className={cn("absolute right-12 bottom-0", className)}
      width={width}
      height={height}
      loading="eager"
    />
  );
}

export { RedPointer };
