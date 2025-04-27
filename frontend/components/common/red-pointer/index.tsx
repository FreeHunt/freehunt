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

function RedPointerWithSpiral({
  width = 327,
  height = 297,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/assets/red-pointer-with-spiral.svg"
      alt=""
      className={cn("hidden lg:block absolute -right-53 -bottom-38", className)}
      width={width}
      height={height}
      loading="eager"
    />
  );
}

export { RedPointer, RedPointerWithSpiral };
