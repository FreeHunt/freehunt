"use client";

import { Banner } from "@/components/common/banner";
import { FreelanceCard } from "@/components/freelance/card";
import { Slider } from "@/components/ui/slider";
import { formatNumberToEuros } from "@/lib/utils";
import { SearchInput } from "@/components/common/search-input";
import { Badge } from "@/components/ui/badge";
import { searchFreelances } from "@/actions/freelances";
import { useState, useEffect, useCallback } from "react";
import { FreelanceSearchResult, Skill } from "@/lib/interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleBadge } from "@/components/common/toggle-badge";
import { getSkills } from "@/actions/skills";
import debounce from "debounce";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { Button as FreeHuntButton } from "@/components/common/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

const MINIMUM_AVERAGE_DAILY_RATE = 0;
const MAXIMUM_AVERAGE_DAILY_RATE = 1500;
const SLIDER_STEP = 100;
const DEBOUNCE_DELAY = 300;
const DEFAULT_PAGE_SIZE = 10;

type SeniorityOption = {
  value: string;
  label: string;
  min?: number;
  max?: number;
};

const SENIORITY_OPTIONS: SeniorityOption[] = [
  { value: "any", label: "Tous niveaux" },
  { value: "junior", label: "0 à 2 ans", min: 0, max: 2 },
  { value: "intermediate", label: "2 à 5 ans", min: 2, max: 5 },
  { value: "senior", label: "7 à 10 ans", min: 7, max: 10 },
  { value: "expert", label: "10 ans et +", min: 10 },
];

function Page() {
  const searchParams = useSearchParams();

  const [minimumAverageDailyRate, setMinimumAverageDailyRate] = useState(
    MINIMUM_AVERAGE_DAILY_RATE,
  );
  const [maximumAverageDailyRate, setMaximumAverageDailyRate] = useState(
    MAXIMUM_AVERAGE_DAILY_RATE,
  );
  const [freelancesLoading, setFreelancesLoading] = useState(true);
  const [freelanceResults, setFreelanceResults] =
    useState<FreelanceSearchResult>({
      data: [],
      total: 0,
    });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("any");

  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      let localSkills = await getSkills();
      localSkills = localSkills.slice(0, 10); // Limit to 10 skills for display

      // Get skill parameters from URL
      const skillParameters = searchParams.getAll("skills");

      if (localSkills.length > 0 && skillParameters.length > 0) {
        const selectedSkills = localSkills.filter((skill) =>
          skillParameters.includes(skill.name),
        );
        setSelectedSkills(selectedSkills);
      }

      setSkills(localSkills);
      setSkillsLoading(false);
    };

    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFreelances = useCallback(
    async (query = "", page = 1) => {
      setFreelancesLoading(true);
      // Get seniority range based on selection
      const selectedOption = SENIORITY_OPTIONS.find(
        (option) => option.value === selectedSeniority,
      );

      const results = await searchFreelances({
        query,
        minimumAverageDailyRate,
        maximumAverageDailyRate,
        skills: selectedSkills,
        minSeniority: selectedOption?.min,
        maxSeniority: selectedOption?.max,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      // Update URL search params
      const params = new URLSearchParams();
      params.set("query", query);
      params.set("page", page.toString());
      selectedSkills.forEach((skill) => {
        params.append("skills", skill.name);
      });
      if (selectedSeniority) {
        params.set("seniority", selectedSeniority);
      }
      window.history.replaceState({}, "", `?${params.toString()}`);

      setFreelanceResults(results);
      setFreelancesLoading(false);
    },
    [
      minimumAverageDailyRate,
      maximumAverageDailyRate,
      selectedSkills,
      selectedSeniority,
    ],
  );

  // Debounced version of fetchFreelances for text search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchFreelances = useCallback(
    debounce((query: string, page: number) => {
      fetchFreelances(query, page);
    }, DEBOUNCE_DELAY),
    [fetchFreelances],
  );

  // Initial load and when filters change
  useEffect(() => {
    debouncedFetchFreelances(searchQuery, currentPage);
    // Cancel any pending debounced calls when component unmounts
    return () => debouncedFetchFreelances.clear();
  }, [debouncedFetchFreelances, searchQuery, currentPage]);

  // Upon page load if there are any search parameters
  useEffect(() => {
    const query = searchParams.get("query");
    const page = searchParams.get("page");
    const seniority = searchParams.get("seniority");

    if (query) {
      setSearchQuery(query);
    }

    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber)) {
        setCurrentPage(pageNumber);
      }
    }

    if (seniority) {
      setSelectedSeniority(seniority);
    }
  }, [searchParams]);

  // Handle search form submission
  const handleSearch = async (formData: FormData) => {
    const query = formData.get("search") as string;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when changing search
  };

  // Handle skill selection with debounce
  const handleSkillToggle = useCallback((skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.id === skill.id)
        ? prev.filter((s) => s.id !== skill.id)
        : [...prev, skill],
    );
    setCurrentPage(1); // Reset to first page when changing filters
  }, []);

  // Handle slider value change with debounce
  const handleSliderValueChange = useCallback((value: number[]) => {
    setMinimumAverageDailyRate(value[0]);
    setMaximumAverageDailyRate(value[1]);
    setCurrentPage(1); // Reset to first page when changing filters
  }, []);

  // Handle seniority selection
  const handleSeniorityChange = useCallback((value: string) => {
    setSelectedSeniority(value);
    setCurrentPage(1); // Reset to first page when changing filters
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(freelanceResults.total / DEFAULT_PAGE_SIZE);

  return (
    <>
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
                    isActive={selectedSkills.some((s) => s.id === skill.id)}
                  />
                ))}
            </div>
          </div>

          {/* Seniority level radio group */}
          <div className="flex flex-col gap-2.5 items-start w-full">
            <p className="font-semibold">Niveau d&apos;expérience</p>
            <RadioGroup
              defaultValue="any"
              value={selectedSeniority}
              onValueChange={handleSeniorityChange}
              className="flex flex-col gap-2 w-full"
            >
              {SENIORITY_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`seniority-${option.value}`}
                  />
                  <Label
                    htmlFor={`seniority-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="search"
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
              {freelanceResults.total}
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
            {freelanceResults.data.length > 0 &&
              !freelancesLoading &&
              freelanceResults.data.map((freelance) => (
                <FreelanceCard key={freelance.id} {...freelance} />
              ))}
            {!freelancesLoading && freelanceResults.data.length === 0 && (
              <p className="text-freehunt-black-two col-span-full text-center py-8">
                Aucun freelance trouvé.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !freelancesLoading && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}

                  {/* First page */}
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Ellipsis if needed */}
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Previous page if not first */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Current page */}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive
                      onClick={(e) => e.preventDefault()}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>

                  {/* Next page if not last */}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Ellipsis if needed */}
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Last page */}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Page;
