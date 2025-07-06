"use client";

import MultiStepForm from "@/components/multi-step-form";

function Page() {
  return (
    <div className="flex">
      <main className="flex flex-col flex-1 px-4 py-6 gap-5">
        <h1 className="text-freehunt-main font-bold text-2xl">
          Créer une annonce
        </h1>
        <h2 className="text-muted-foreground">
          Publiez une annonce claire et précise pour attirer les meilleurs
          freelances. Décrivez vos attentes, vos objectifs, et les compétences
          recherchées.
        </h2>
        <MultiStepForm />
      </main>
    </div>
  );
}

export default Page;
