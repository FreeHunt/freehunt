"use client";
import { BasePage } from "@/components/common/base-page";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();

  return (
    <BasePage>
      <div className="flex flex-col items-center gap-8 md:gap-20 my-10 md:my-28">
        <div className="flex flex-col justify-center items-center gap-2 self-stretch px-4">
          <div className="flex p-5 justify-center items-center gap-2">
            <p className="text-freehunt-main text-2xl md:text-4xl text-center font-bold">
              Bienvenue !
            </p>
          </div>
          <p className="text-freehunt-black-two text-xl md:text-2xl text-center font-normal">
            Quel type de profil êtes-vous ?
          </p>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 md:gap-20 self-stretch px-4 overflow-x-auto"></div>
      </div>
    </BasePage>
  );
}

export default Page;
