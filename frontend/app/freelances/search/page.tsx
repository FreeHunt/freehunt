"use client";

import { Banner } from "@/components/common/banner";
import { BasePage } from "@/components/common/base-page";
import { FreelanceCard } from "@/components/freelance/card";
import { Slider } from "@/components/ui/slider";
import { formatNumberToEuros } from "@/lib/utils";
import { SearchInput } from "@/components/common/input";
import { Badge } from "@/components/ui/badge";
import { searchFreelances } from "@/actions/freelances";
import { useState, useEffect, useCallback } from "react";
import { Freelance, Skill } from "@/lib/interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleBadge } from "@/components/common/toggle-badge";
import { getSkills } from "@/actions/skills";
import debounce from "debounce";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { Button as FreeHuntButton } from "@/components/common/button";

const MINIMUM_AVERAGE_DAILY_RATE = 0;
const MAXIMUM_AVERAGE_DAILY_RATE = 1500;
const SLIDER_STEP = 100;
const DEBOUNCE_DELAY = 300;

function Page() {
  const [minimumAverageDailyRate, setMinimumAverageDailyRate] = useState(
    MINIMUM_AVERAGE_DAILY_RATE,
  );
  const [maximumAverageDailyRate, setMaximumAverageDailyRate] = useState(
    MAXIMUM_AVERAGE_DAILY_RATE,
  );
  const [freelancesLoading, setFreelancesLoading] = useState(true);
  const [freelances, setFreelances] = useState<Freelance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      const skills = await getSkills();
      setSkills(skills.slice(0, 10)); // Limit to 10 skills for display
      setSkillsLoading(false);
    };

    fetchSkills();
  }, []);

  const fetchFreelances = useCallback(
    async (query = "") => {
      const freelances = await searchFreelances({
        query,
        minimumAverageDailyRate,
        maximumAverageDailyRate,
        skills: selectedSkills,
      });
      setFreelances(freelances);
      setFreelancesLoading(false);
    },
    [minimumAverageDailyRate, maximumAverageDailyRate, selectedSkills],
  );

  // Debounced version of fetchFreelances
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchFreelances = useCallback(
    debounce((query: string) => {
      fetchFreelances(query);
    }, DEBOUNCE_DELAY),
    [fetchFreelances],
  );

  // Initial load and when filters change
  useEffect(() => {
    debouncedFetchFreelances(searchQuery);
    // Cancel any pending debounced calls when component unmounts
    return () => debouncedFetchFreelances.clear();
  }, [debouncedFetchFreelances, searchQuery]);

  // Handle search form submission
  const handleSearch = async (formData: FormData) => {
    const query = formData.get("search") as string;
    setSearchQuery(query);
  };

  // Handle skill selection with debounce
  const handleSkillToggle = useCallback((skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.id === skill.id)
        ? prev.filter((s) => s.id !== skill.id)
        : [...prev, skill],
    );
  }, []);

  // Handle slider value change with debounce
  const handleSliderValueChange = useCallback((value: number[]) => {
    setMinimumAverageDailyRate(value[0]);
    setMaximumAverageDailyRate(value[1]);
  }, []);

  return (
    <BasePage>
      {/* Decoration Banner */}
      <Banner text="Trouvez le freelance de vos rêves." />

      <div className="flex flex-col lg:flex-row px-4 lg:px-5 gap-5 relative">
        {/* Sidebar - Hidden on mobile by default, shown when sidebarOpen is true */}
        <aside
          className={`
          ${sidebarOpen ? "flex" : "hidden"}
          lg:flex flex-col py-4 lg:py-7 px-4 lg:pl-5 lg:pr-10 gap-5
          w-full lg:w-[276px] lg:border-r border-freehunt-grey
          fixed lg:static top-0 left-0 h-full lg:h-auto
          bg-white lg:bg-transparent z-50 overflow-y-auto
          max-w-[100vw] lg:max-w-none
        `}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-freehunt-black-two">
              Filtres
            </h2>
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              size="sm"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Average Daily Rate (ADR) Slider */}
          <div className="flex flex-col gap-2.5 items-start w-full">
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
              onValueChange={handleSliderValueChange}
            />
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-freehunt-black-two">
                {formatNumberToEuros(minimumAverageDailyRate)}
              </p>
              <p className="text-sm text-freehunt-black-two">
                {formatNumberToEuros(maximumAverageDailyRate)}
              </p>
            </div>
          </div>

          {/* Technical skills */}
          <div className="flex flex-col gap-2.5 items-start w-full">
            <p className="font-semibold">Compétences techniques</p>
            <div className="flex flex-wrap gap-2.5 w-full">
              {skillsLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-[63px] h-4 rounded-[8px]"
                  />
                ))}
              {!skillsLoading &&
                skills.map((skill) => (
                  <ToggleBadge
                    key={skill.id}
                    value={skill.name}
                    onClick={() => handleSkillToggle(skill)}
                  />
                ))}
            </div>
          </div>

          {/* Mobile apply filters button */}
          <FreeHuntButton
            className="mt-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            Appliquer les filtres
          </FreeHuntButton>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main */}
        <main className="flex flex-col gap-5 w-full py-2 lg:py-5">
          <form action={handleSearch} className="w-full">
            {/* Search Bar */}
            <SearchInput
              placeholder="Intitulé du poste, technologies..."
              className="w-full text-sm lg:text-base px-6 lg:px-12 mt-2 lg:mt-0"
            />
          </form>

          {/* Mobile Filter Toggle Button */}
          <FreeHuntButton
            variant="outline"
            theme="secondary"
            className="flex lg:hidden items-center gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Filter size={16} />
            Filtres
          </FreeHuntButton>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {freelancesLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-[362px] h-[300px] rounded-[30px]"
                />
              ))}
            {freelances.length > 0 &&
              freelances.map((freelance) => (
                <FreelanceCard key={freelance.id} {...freelance} />
              ))}
            {!freelancesLoading && freelances.length === 0 && (
              <p className="text-freehunt-black-two col-span-full text-center py-8">
                Aucun freelance trouvé.
              </p>
            )}
          </div>
        </main>
      </div>
    </BasePage>
  );
}

export default Page;
