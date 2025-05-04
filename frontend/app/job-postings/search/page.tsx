"use client";

import { Banner } from "@/components/common/banner";
import { JobPostingCard } from "@/components/job-posting/card";
import { Slider } from "@/components/ui/slider";
import { formatNumberToEuros } from "@/lib/utils";
import { SearchInput } from "@/components/common/search-input";
import { Badge } from "@/components/ui/badge";
import { searchJobPostings } from "@/actions/jobPostings";
import { useState, useEffect, useCallback, Suspense } from "react";
import {
  JobPostingSearchResult,
  Skill,
  JobPostingLocation,
} from "@/lib/interfaces";
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

type LocationOption = {
  value: JobPostingLocation | "any";
  label: string;
};

const LOCATION_OPTIONS: LocationOption[] = [
  { value: "any", label: "Toutes localisations" },
  { value: JobPostingLocation.ONSITE, label: "Sur site" },
  { value: JobPostingLocation.REMOTE, label: "Télétravail" },
  { value: JobPostingLocation.HYBRID, label: "Hybride" },
];

// Create a client component that safely uses useSearchParams
function SearchPageContent() {
  const searchParams = useSearchParams();

  const [minimumAverageDailyRate, setMinimumAverageDailyRate] = useState(
    MINIMUM_AVERAGE_DAILY_RATE,
  );
  const [maximumAverageDailyRate, setMaximumAverageDailyRate] = useState(
    MAXIMUM_AVERAGE_DAILY_RATE,
  );
  const [jobPostingsLoading, setJobPostingsLoading] = useState(true);
  const [jobPostingResults, setJobPostingResults] =
    useState<JobPostingSearchResult>({
      data: [],
      total: 0,
    });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("any");
  const [selectedLocation, setSelectedLocation] = useState<
    JobPostingLocation | "any"
  >("any");

  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      let localSkills = await getSkills();
      localSkills = localSkills.slice(0, 10);

      const skillParams = searchParams.getAll("skills");

      if (localSkills.length > 0 && skillParams.length > 0) {
        const preSelectedSkills = localSkills.filter((skill) =>
          skillParams.includes(skill.name),
        );
        setSelectedSkills(preSelectedSkills);
      }

      setSkills(localSkills);
      setSkillsLoading(false);
    };

    fetchSkills();
    // Only run this once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const title = searchParams.get("title");
    const page = searchParams.get("page");
    const seniority = searchParams.get("seniority");
    const location = searchParams.get("location");

    if (title) {
      setSearchQuery(title);
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

    if (
      location &&
      Object.values(JobPostingLocation).includes(location as JobPostingLocation)
    ) {
      setSelectedLocation(location as JobPostingLocation);
    }
    // Only run this once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobPostings = useCallback(
    async (title = "", page = 1) => {
      setJobPostingsLoading(true);
      const selectedSeniorityOption = SENIORITY_OPTIONS.find(
        (option) => option.value === selectedSeniority,
      );

      const results = await searchJobPostings({
        title: title || undefined,
        skillNames:
          selectedSkills.length > 0
            ? selectedSkills.map((s) => s.name)
            : undefined,
        location: selectedLocation === "any" ? undefined : selectedLocation,
        minimumAverageDailyRate,
        maximumAverageDailyRate,
        minSeniority: selectedSeniorityOption?.min,
        maxSeniority: selectedSeniorityOption?.max,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      const params = new URLSearchParams();
      if (title) params.set("title", title);
      params.set("page", page.toString());
      selectedSkills.forEach((skill) => {
        params.append("skills", skill.name);
      });
      if (selectedSeniority !== "any") {
        params.set("seniority", selectedSeniority);
      }
      if (selectedLocation !== "any") {
        params.set("location", selectedLocation);
      }
      window.history.replaceState({}, "", `?${params.toString()}`);

      setJobPostingResults(results);
      setJobPostingsLoading(false);
    },
    [
      minimumAverageDailyRate,
      maximumAverageDailyRate,
      selectedSkills,
      selectedSeniority,
      selectedLocation,
    ],
  );

  const debouncedFetchJobPostings = useCallback(
    (query: string, page: number) => {
      const debouncedFn = debounce((q: string, p: number) => {
        fetchJobPostings(q, p);
      }, DEBOUNCE_DELAY);

      debouncedFn(query, page);
      return () => debouncedFn.clear();
    },
    [fetchJobPostings],
  );

  useEffect(() => {
    const cleanup = debouncedFetchJobPostings(searchQuery, currentPage);

    return cleanup;
  }, [
    debouncedFetchJobPostings,
    searchQuery,
    currentPage,
    selectedSkills,
    selectedSeniority,
    selectedLocation,
    minimumAverageDailyRate,
    maximumAverageDailyRate,
  ]);

  const handleSearch = async (formData: FormData) => {
    const query = formData.get("search") as string;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSkillToggle = useCallback((skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.id === skill.id)
        ? prev.filter((s) => s.id !== skill.id)
        : [...prev, skill],
    );
    setCurrentPage(1);
  }, []);

  const handleSliderValueChange = useCallback((value: number[]) => {
    setMinimumAverageDailyRate(value[0]);
    setMaximumAverageDailyRate(value[1]);
    setCurrentPage(1);
  }, []);

  const handleSeniorityChange = useCallback((value: string) => {
    setSelectedSeniority(value);
    setCurrentPage(1);
  }, []);

  const handleLocationChange = useCallback(
    (value: JobPostingLocation | "any") => {
      setSelectedLocation(value);
      setCurrentPage(1);
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalPages = Math.ceil(jobPostingResults.total / DEFAULT_PAGE_SIZE);

  return (
    <>
      <Banner
        text="Trouvez l'offre qui vous correspond."
        redPointerClassName="right-0"
      />
      <div className="flex flex-col lg:flex-row px-4 lg:px-5 gap-5 relative">
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

          <div className="flex flex-col gap-2.5 items-start w-full">
            <p className="font-semibold">Localisation</p>
            <RadioGroup
              value={selectedLocation}
              onValueChange={handleLocationChange}
              className="flex flex-col gap-2 w-full"
            >
              {LOCATION_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`location-${option.value}`}
                  />
                  <Label
                    htmlFor={`location-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2.5 items-start w-full">
            <p className="font-semibold">Niveau d&apos;expérience</p>
            <RadioGroup
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

          <FreeHuntButton
            className="mt-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            Appliquer les filtres
          </FreeHuntButton>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <main className="flex flex-col gap-5 w-full py-2 lg:py-5">
          <form action={handleSearch} className="w-full">
            <SearchInput
              placeholder="Intitulé du poste, technologies..."
              className="w-full text-sm lg:text-base px-6 lg:px-12 mt-2 lg:mt-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="search"
            />
          </form>

          <FreeHuntButton
            variant="outline"
            theme="secondary"
            className="flex lg:hidden items-center gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Filter size={16} />
            Filtres
          </FreeHuntButton>

          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-freehunt-black-two text-xl">
              Offres d&apos;emploi
            </h1>
            <Badge className="bg-freehunt-main font-bold text-white">
              {jobPostingResults.total}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {jobPostingsLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full max-w-[340px] h-[300px] rounded-[30px]"
                />
              ))}
            {jobPostingResults.data.length > 0 &&
              !jobPostingsLoading &&
              [...jobPostingResults.data]
                .sort((a, b) => {
                  if (a.isPromoted && !b.isPromoted) return -1;
                  if (!a.isPromoted && b.isPromoted) return 1;
                  return 0;
                })
                .map((jobPosting) => (
                  <JobPostingCard key={jobPosting.id} {...jobPosting} />
                ))}
            {!jobPostingsLoading && jobPostingResults.data.length === 0 && (
              <p className="text-freehunt-black-two col-span-full text-center py-8">
                Aucune offre d&apos;emploi trouvée.
              </p>
            )}
          </div>

          {totalPages > 1 && !jobPostingsLoading && (
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

                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

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

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive
                      onClick={(e) => e.preventDefault()}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>

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

                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

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

// Main page component with suspense boundary
function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10">Chargement...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

export default Page;
