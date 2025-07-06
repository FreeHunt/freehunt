"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

function AboutCardColumn({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 lg:gap-[34px]">{children}</div>;
}

function AboutCard({
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
        "flex flex-col justify-center lg:w-[312px] lg:h-[200px] bg-white rounded-xl px-6 py-8 gap-2.5",
        className,
      )}
    >
      <h3 className="font-medium text-4xl lg:text-5xl">{title}</h3>
      <p className="text-lg lg:text-xl">{content}</p>
    </div>
  );
}

function ValueCard({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center bg-white rounded-xl px-6 py-8 gap-3 text-center",
        className,
      )}
    >
      <h3 className="font-bold text-2xl lg:text-3xl">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <section className="flex items-center justify-center p-10 lg:p-20 bg-freehunt-beige-dark">
        <div className="flex flex-col items-center max-w-4xl gap-7 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold">
            À propos de FreeHunt
          </h1>
          <h2 className="text-xl lg:text-2xl font-bold text-freehunt-grey-dark">
            La plateforme qui révolutionne la rencontre entre freelances et
            entreprises
          </h2>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row p-10 lg:p-20 items-center justify-center gap-5 lg:gap-[92px]">
        <div className="flex flex-col gap-8 max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-center lg:text-left">
            Notre mission
          </h2>
          <div className="flex flex-col gap-6 text-lg lg:text-xl text-freehunt-grey-dark">
            <p>
              FreeHunt simplifie la connexion entre les entreprises en quête de
              talents et les freelances passionnés. Notre plateforme offre un
              environnement sécurisé et intuitif où chaque projet trouve son
              expert.
            </p>
            <p>
              Nous croyons en un monde du travail plus flexible, où la
              collaboration transcende les frontières géographiques et où
              l&apos;excellence n&apos;a pas de limites.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row pb-10 lg:px-20 lg:pb-20 justify-between items-center gap-3">
        <AboutCardColumn>
          <AboutCard
            title="+ 7 000"
            content="Freelances inscrits"
            className="bg-white border border-freehunt-grey shadow-md hover:shadow-lg transition-shadow"
          />
          <AboutCard
            title="+ 800"
            content="Entreprises inscrites"
            className="bg-freehunt-main text-white shadow-md hover:shadow-lg transition-shadow"
          />
        </AboutCardColumn>

        <Image
          src="/assets/about.jpg"
          width={443}
          height={428}
          alt=""
          className="hidden lg:block object-cover lg:h-[428px] lg:w-[443px] rounded-xl"
        />

        <AboutCardColumn>
          <AboutCard
            title="98%"
            content="Utilisateurs satisfaits"
            className="bg-freehunt-main text-white shadow-md hover:shadow-lg transition-shadow"
          />
          <AboutCard
            title="+ 9 000"
            content="Postes pourvus"
            className="bg-white border border-freehunt-grey shadow-md hover:shadow-lg transition-shadow"
          />
        </AboutCardColumn>
      </section>

      <section className="p-10 lg:p-20 bg-freehunt-beige-dark">
        <div className="flex flex-col items-center gap-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            <ValueCard
              title="Innovation"
              description="Nous repoussons constamment les limites technologiques"
              className="bg-white border border-freehunt-grey shadow-md hover:shadow-lg transition-shadow hover:border-freehunt-main"
            />
            <ValueCard
              title="Qualité"
              description="Excellence et professionnalisme dans chaque interaction"
              className="bg-freehunt-main text-white shadow-md hover:shadow-lg transition-shadow"
            />
            <ValueCard
              title="Simplicité"
              description="Une expérience utilisateur fluide et intuitive"
              className="bg-white border border-freehunt-grey shadow-md hover:shadow-lg transition-shadow hover:border-freehunt-main"
            />
            <ValueCard
              title="Confiance"
              description="Un environnement sécurisé pour tous nos utilisateurs"
              className="bg-freehunt-main text-white shadow-md hover:shadow-lg transition-shadow"
            />
          </div>
        </div>
      </section>
    </>
  );
}
