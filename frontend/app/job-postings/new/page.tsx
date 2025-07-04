"use client";

import MultiStepForm from "@/components/multi-step-form";

function Page() {
  return (
    <div className="flex">
      <main className="flex flex-col flex-1 px-4 py-6 gap-5">
        <h1 className="text-freehunt-main font-bold text-2xl">
          Créer une annonce
        </h1>
        <h2 className="text-gray-500">
          Publiez une annonce claire et précise pour attirer les meilleurs
          freelances. Décrivez vos attentes, vos objectifs, et les compétences
          recherchées.
        </h2>
        {/*<form className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
        </form> */}
        <MultiStepForm />
      </main>
    </div>
  );
}

export default Page;
