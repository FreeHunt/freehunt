"use client";

import { ReactNode } from "react";
import { SearchInput } from "@/components/common/search-input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  RedPointer,
  RedPointerWithSpiral,
} from "@/components/common/red-pointer";
import { useRouter } from "next/navigation";

function HomeCardColumn({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 lg:gap-[34px]">{children}</div>;
}

function HomeCard({
  title,
  content,
  className,
}: {
  title: string;
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center lg:w-[312px] lg:h-[200px] bg-white rounded-3xl px-[25px] py-[30px] gap-2.5",
        className,
      )}
    >
      <h3 className="font-medium text-4xl lg:text-5xl">{title}</h3>
      <p className="text-lg lg:text-xl">{content}</p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    router.push(`/job-postings/search?title=${search}&page=1`);
  };

  return (
    <>
      <section className="flex items-center justify-between p-10 lg:p-20 bg-freehunt-beige-dark">
        {/* Side Image 1 */}
        <Image
          src="/assets/home-side-1.svg"
          alt=""
          className="hidden lg:block"
          width={199}
          height={461}
          loading="eager"
        />

        <div className="flex flex-col items-center lg:w-[476px] gap-7 text-center">
          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold relative">
            Trouvez votre prochain challenge
            <RedPointerWithSpiral />
            <RedPointer className="lg:hidden right-0 md:-right-15" />
          </h1>

          {/* Subtitle */}
          <h2 className="font-bold text-freehunt-grey-dark">
            Accédez à des centaines de missions postées par des entreprises du
            monde entier.
          </h2>

          {/* Search Bar */}
          <form className="w-full" onSubmit={handleSubmit}>
            {" "}
            <SearchInput
              placeholder="Exemple : React, MongoDB..."
              className="px-6 lg:px-12 w-full text-sm lg:text-base bg-white py-0 h-[50px] border-freehunt-grey text-freehunt-grey placeholder:text-freehunt-grey focus-visible:border-freehunt-grey"
              buttonText="Démarrer"
              buttonClassName="right-2 bg-freehunt-black-two"
            />
          </form>
        </div>

        {/* Side Image 2 */}
        <Image
          src="/assets/home-side-2.svg"
          alt=""
          className="hidden lg:block"
          width={199}
          height={461}
          loading="eager"
        />
      </section>

      <section className="flex flex-col lg:flex-row p-10 lg:p-20 items-center justify-center gap-5 lg:gap-[92px]">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Chaque annonce est une nouvelle aventure
        </h2>

        <p className="text-lg lg:text-2xl font-bold text-freehunt-grey-dark">
          Que vous soyez développeur, designer, rédacteur ou expert en
          marketing, trouvez des missions adaptées à vos compétences en quelques
          clics.
        </p>
      </section>

      <section className="flex flex-col lg:flex-row pb-10 lg:px-20 lg:pb-20 justify-between items-center gap-3">
        <HomeCardColumn>
          <HomeCard
            title="+ 7 000"
            content="Freelances inscrits"
            className="bg-freehunt-main"
          />
          <HomeCard
            title="+ 800"
            content="Entreprises inscrites"
            className="bg-freehunt-blue"
          />
        </HomeCardColumn>

        <Image
          src="/assets/home.jpg"
          width={443}
          height={428}
          alt=""
          className="hidden lg:block object-cover lg:h-[428px] lg:w-[443px] rounded-3xl"
        />

        <HomeCardColumn>
          <HomeCard
            title="98%"
            content="Utilisateurs satisfaits"
            className="bg-freehunt-yellow"
          />
          <HomeCard
            title="+ 9 000"
            content="Postes pourvus"
            className="bg-freehunt-green"
          />
        </HomeCardColumn>
      </section>
    </>
  );
}
