"use client";

import Image from "next/image";

function StatCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <h3 className="text-4xl lg:text-5xl font-bold text-freehunt-main mb-3">
        {title}
      </h3>
      <p className="text-lg text-gray-700">{content}</p>
    </div>
  );
}

function ValueCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group hover:border-freehunt-main">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-2xl lg:text-3xl mb-4 text-gray-800">
        {title}
      </h3>
      <p className="text-lg text-gray-600">{description}</p>
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

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Stats Column 1 */}
            <div className="space-y-6">
              <StatCard title="+ 7 000" content="Freelances inscrits" />
              <StatCard title="+ 800" content="Entreprises inscrites" />
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <Image
                src="/assets/about.jpg"
                width={443}
                height={428}
                alt="Équipe FreeHunt travaillant sur la plateforme"
                className="object-cover h-[400px] w-full max-w-[400px] rounded-2xl shadow-xl"
              />
            </div>

            {/* Stats Column 2 */}
            <div className="space-y-6">
              <StatCard title="98%" content="Utilisateurs satisfaits" />
              <StatCard title="+ 9 000" content="Postes pourvus" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col items-center gap-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-center">
              Nos valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
              <ValueCard
                title="Innovation"
                description="Nous repoussons constamment les limites technologiques"
                icon="💡"
              />
              <ValueCard
                title="Qualité"
                description="Excellence et professionnalisme dans chaque interaction"
                icon="⭐"
              />
              <ValueCard
                title="Simplicité"
                description="Une expérience utilisateur fluide et intuitive"
                icon="🎯"
              />
              <ValueCard
                title="Confiance"
                description="Un environnement sécurisé pour tous nos utilisateurs"
                icon="🔒"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
