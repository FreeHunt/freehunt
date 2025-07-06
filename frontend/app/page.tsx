"use client";

import { SearchInput } from "@/components/common/search-input";
import Image from "next/image";
import { useEffect } from "react";

import { useAuth } from "@/actions/auth";
import {
  RedPointer,
  RedPointerWithSpiral,
} from "@/components/common/red-pointer";
import { UserRole } from "@/lib/interfaces";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === UserRole.FREELANCE) {
        router.push("/dashboard/freelance");
      } else if (user.role === UserRole.COMPANY) {
        router.push("/dashboard/company");
      }
    }
  }, [user, isLoading, router]);

  const handleSearch = (formData: FormData) => {
    const query = formData.get("search") as string;
    if (query?.trim()) {
      router.push(
        `/job-postings/search?title=${encodeURIComponent(query.trim())}`,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Chargement...</div>
      </div>
    );
  }

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
          <form action={handleSearch} className="w-full">
            <SearchInput
              placeholder="Exemple : React, MongoDB..."
              className="px-6 lg:px-12 w-full text-sm lg:text-base bg-white py-0 h-[50px] border-freehunt-grey text-freehunt-grey placeholder:text-freehunt-grey focus-visible:border-freehunt-grey"
              buttonText="Démarrer"
              buttonClassName="right-2 bg-freehunt-black-two"
              name="search"
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

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Stats Column 1 */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h3 className="text-4xl lg:text-5xl font-bold text-freehunt-main mb-3">
                  + 7 000
                </h3>
                <p className="text-lg text-gray-700">Freelances inscrits</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h3 className="text-4xl lg:text-5xl font-bold text-freehunt-main mb-3">
                  + 800
                </h3>
                <p className="text-lg text-gray-700">Entreprises inscrites</p>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <Image
                src="/assets/home.jpg"
                width={443}
                height={428}
                alt="Équipe de freelances travaillant ensemble"
                className="object-cover h-[400px] w-full max-w-[400px] rounded-2xl shadow-xl"
              />
            </div>

            {/* Stats Column 2 */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h3 className="text-4xl lg:text-5xl font-bold text-freehunt-main mb-3">
                  98%
                </h3>
                <p className="text-lg text-gray-700">Utilisateurs satisfaits</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <h3 className="text-4xl lg:text-5xl font-bold text-freehunt-main mb-3">
                  + 9 000
                </h3>
                <p className="text-lg text-gray-700">Postes pourvus</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
