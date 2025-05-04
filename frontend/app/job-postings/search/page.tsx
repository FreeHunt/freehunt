"use client";

import { Banner } from "@/components/common/banner";
import { JobPostingCard } from "@/components/job-posting/card"; // Changed import
import { Slider } from "@/components/ui/slider";
import { formatNumberToEuros } from "@/lib/utils";
import { SearchInput } from "@/components/common/search-input";
import { Badge } from "@/components/ui/badge";
import { searchJobPostings } from "@/actions/jobPostings"; // Changed import
import { useState, useEffect, useCallback } from "react";
import {
  JobPostingSearchResult,
  Skill,
  JobPostingLocation,
} from "@/lib/interfaces"; // Changed import
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

// Added Location Options
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

function Page() {
  const searchParams = useSearchParams();

  const [minimumAverageDailyRate, setMinimumAverageDailyRate] = useState(
    MINIMUM_AVERAGE_DAILY_RATE,
  );
  const [maximumAverageDailyRate, setMaximumAverageDailyRate] = useState(
    MAXIMUM_AVERAGE_DAILY_RATE,
  );
  const [jobPostingsLoading, setJobPostingsLoading] = useState(true); // Renamed state
  const [jobPostingResults, setJobPostingResults] = // Renamed state
    useState<JobPostingSearchResult>({
      data: [],
      total: 0,
    });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Will be used for 'title'
  const [selectedSeniority, setSelectedSeniority] = useState<string>("any");
  const [selectedLocation, setSelectedLocation] = useState<
    JobPostingLocation | "any"
  >("any"); // Added state for location

  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch skills (remains the same)
  useEffect(() => {
    const fetchSkills = async () => {
      let localSkills = await getSkills();
      localSkills = localSkills.slice(0, 10); // Limit to 10 skills for display

      const skillParameters = searchParams.getAll("skills");

      if (localSkills.length > 0 && skillParameters.length > 0) {
        const preSelectedSkills = localSkills.filter((skill) =>
          skillParameters.includes(skill.name),
        );
        setSelectedSkills(preSelectedSkills);
      }

      setSkills(localSkills);
      setSkillsLoading(false);
    };

    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Renamed and adapted fetch function
  const fetchJobPostings = useCallback(
    async (title = "", page = 1) => {
      setJobPostingsLoading(true);
      const selectedSeniorityOption = SENIORITY_OPTIONS.find(
        (option) => option.value === selectedSeniority,
      );

      const results = await searchJobPostings({
        title: title || undefined, // Use searchQuery for title
        skillNames:
          selectedSkills.length > 0
            ? selectedSkills.map((s) => s.name)
            : undefined,
        location: selectedLocation === "any" ? undefined : selectedLocation, // Handle 'any' location
        minimumAverageDailyRate,
        maximumAverageDailyRate,
        minSeniority: selectedSeniorityOption?.min,
        maxSeniority: selectedSeniorityOption?.max,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      // Update URL search params
      const params = new URLSearchParams();
      if (title) params.set("title", title); // Changed from query to title
      params.set("page", page.toString());
      selectedSkills.forEach((skill) => {
        params.append("skills", skill.name);
      });
      if (selectedSeniority !== "any") {
        params.set("seniority", selectedSeniority);
      }
      if (selectedLocation !== "any") {
        params.set("location", selectedLocation); // Added location param
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
      selectedLocation, // Added dependency
    ],
  );

  // Debounced version of fetchJobPostings
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchJobPostings = useCallback(
    debounce((query: string, page: number) => {
      fetchJobPostings(query, page);
    }, DEBOUNCE_DELAY),
    [fetchJobPostings],
  );

  // Initial load and when filters change
  useEffect(() => {
    debouncedFetchJobPostings(searchQuery, currentPage);
    return () => debouncedFetchJobPostings.clear();
  }, [debouncedFetchJobPostings, searchQuery, currentPage]);

  // Upon page load if there are any search parameters
  useEffect(() => {
    const title = searchParams.get("title"); // Changed from query to title
    const page = searchParams.get("page");
    const seniority = searchParams.get("seniority");
    const location = searchParams.get("location"); // Added location

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
      setSelectedLocation(location as JobPostingLocation); // Added location handling
    }
  }, [searchParams]); // Removed skills dependency as it's handled in its own useEffect

  // Handle search form submission
  const handleSearch = async (formData: FormData) => {
    const query = formData.get("search") as string;
    setSearchQuery(query); // This state is used as 'title' in fetchJobPostings
    setCurrentPage(1);
  };

  // Handle skill selection (remains the same)
  const handleSkillToggle = useCallback((skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.id === skill.id)
        ? prev.filter((s) => s.id !== skill.id)
        : [...prev, skill],
    );
    setCurrentPage(1);
  }, []);

  // Handle slider value change (remains the same)
  const handleSliderValueChange = useCallback((value: number[]) => {
    setMinimumAverageDailyRate(value[0]);
    setMaximumAverageDailyRate(value[1]);
    setCurrentPage(1);
  }, []);

  // Handle seniority selection (remains the same)
  const handleSeniorityChange = useCallback((value: string) => {
    setSelectedSeniority(value);
    setCurrentPage(1);
  }, []);

  // Added handler for location selection
  const handleLocationChange = useCallback(
    (value: JobPostingLocation | "any") => {
      setSelectedLocation(value);
      setCurrentPage(1);
    },
    [],
  );

  // Handle page change (remains the same)
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(jobPostingResults.total / DEFAULT_PAGE_SIZE);

  return (
    <>
      {/* Decoration Banner */}
      <Banner text="Trouvez l'offre qui vous correspond." />{" "}
      {/* Changed text */}
      <div className="flex flex-col lg:flex-row px-4 lg:px-5 gap-5 relative">
        {/* Sidebar */}
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

          {/* Location radio group */}
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

          {/* Seniority level radio group */}
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

          {/* Mobile apply filters button */}
          <FreeHuntButton
            className="mt-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            Appliquer les filtres
          </FreeHuntButton>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex flex-col gap-5 w-full py-2 lg:py-5">
          <form action={handleSearch} className="w-full">
            <SearchInput
              placeholder="Intitulé du poste, technologies..."
              className="w-full text-sm lg:text-base px-6 lg:px-12 mt-2 lg:mt-0"
              defaultValue={searchQuery} // Ensure input reflects state/URL param
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

          {/* Title & Count */}
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-freehunt-black-two text-xl">
              Offres d&apos;emploi {/* Changed title */}
            </h1>
            <Badge className="bg-freehunt-main font-bold text-white">
              {jobPostingResults.total} {/* Changed result source */}
            </Badge>
          </div>

          {/* Job Posting Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {jobPostingsLoading && // Changed loading state
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full max-w-[340px] h-[300px] rounded-[30px]" // Adjusted skeleton size
                />
              ))}
            {jobPostingResults.data.length > 0 && // Changed result source
              !jobPostingsLoading && // Changed loading state
              jobPostingResults.data.map(
                (
                  jobPosting, // Changed variable name
                ) => (
                  <JobPostingCard key={jobPosting.id} {...jobPosting} /> // Changed card component
                ),
              )}
            {!jobPostingsLoading &&
              jobPostingResults.data.length === 0 && ( // Changed loading state and result source
                <p className="text-freehunt-black-two col-span-full text-center py-8">
                  Aucune offre d&apos;emploi trouvée. {/* Changed text */}
                </p>
              )}
          </div>

          {/* Pagination */}
          {totalPages > 1 &&
            !jobPostingsLoading && ( // Changed loading state
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

export default Page;
