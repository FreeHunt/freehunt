"use client";

import { Banner } from "@/components/common/banner";
import { BasePage } from "@/components/common/base-page";
import { FreelanceCard } from "@/components/freelance/card";
import { Slider } from "@/components/ui/slider";
import { formatNumberToEuros } from "@/lib/utils";
import { SearchInput } from "@/components/common/input";
import { Badge } from "@/components/ui/badge";
import { searchFreelances } from "@/actions/freelances";
import { useState, useEffect } from "react";
import { Freelance } from "@/lib/interfaces";

const MINIMUM_AVERAGE_DAILY_RATE = 0;
const MAXIMUM_AVERAGE_DAILY_RATE = 1500;
const SLIDER_STEP = 100;

function Page() {
  const [minimumAverageDailyRate, setMinimumAverageDailyRate] = useState(
    MINIMUM_AVERAGE_DAILY_RATE,
  );
  const [maximumAverageDailyRate, setMaximumAverageDailyRate] = useState(
    MAXIMUM_AVERAGE_DAILY_RATE,
  );
  const [freelances, setFreelances] = useState<Freelance[]>([]);

  useEffect(() => {
    const fetchFreelances = async () => {
      const freelances = await searchFreelances({
        query: "",
        minimumAverageDailyRate,
        maximumAverageDailyRate,
      });
      setFreelances(freelances);
    };

    fetchFreelances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (formData: FormData) => {
    const searchQuery = formData.get("search") as string;

    const freelances = await searchFreelances({
      query: searchQuery,
      minimumAverageDailyRate,
      maximumAverageDailyRate,
    });

    setFreelances(freelances);
  };

  return (
    <BasePage>
      {/* Decoration Banner */}
      <Banner text="Trouvez le freelance de vos rêves." />

      <div className="flex px-5 gap-5">
        {/* Sidebar */}
        <aside className="flex flex-col py-7 pl-5 pr-10 gap-5 w-[276px] border-r border-freehunt-grey box-content">
          <h2 className="text-xl font-semibold text-freehunt-black-two">
            Filtres
          </h2>

          {/* Average Daily Rate (ADR) Slider */}
          <div className="flex flex-col gap-2.5 items-start self-stretch">
            <p className="font-semibold">Taux journalier moyen (TJM)</p>
            <Slider
              defaultValue={[
                MINIMUM_AVERAGE_DAILY_RATE,
                MAXIMUM_AVERAGE_DAILY_RATE,
              ]}
              min={MINIMUM_AVERAGE_DAILY_RATE}
              max={MAXIMUM_AVERAGE_DAILY_RATE}
              step={SLIDER_STEP}
              className="w-full"
              onValueCommit={(value) => {
                setMinimumAverageDailyRate(value[0]);
                setMaximumAverageDailyRate(value[1]);
              }}
            />
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-freehunt-black-two">
                {formatNumberToEuros(MINIMUM_AVERAGE_DAILY_RATE)}
              </p>
              <p className="text-sm text-freehunt-black-two">
                {formatNumberToEuros(MAXIMUM_AVERAGE_DAILY_RATE)}
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-col gap-5 w-full py-5">
          <form action={handleSearch}>
            {/* Search Bar */}
            <SearchInput placeholder="Intitulé du poste, technologies..." />
          </form>

          {/* Title */}
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-freehunt-black-two text-xl">
              Freelances
            </h1>
            <Badge className="bg-freehunt-main font-bold text-white">
              {freelances.length}
            </Badge>
          </div>

          {/* Freelance Cards */}
          <div className="flex flex-wrap gap-6">
            {freelances.length > 0 ? (
              freelances.map((freelance) => (
                <FreelanceCard key={freelance.id} {...freelance} />
              ))
            ) : (
              <p className="text-freehunt-black-two">Aucun freelance trouvé.</p>
            )}
          </div>
        </main>
      </div>
    </BasePage>
  );
}

export default Page;
