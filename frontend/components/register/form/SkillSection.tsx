import { useState, ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/common/button";
import { TipBox } from "@/components/common/banner/TipBox";
import { Montserrat } from "next/font/google";
import { ZodError, ZodIssue } from "zod";
import { api } from "@/lib/api";
import { Skill } from "@/lib/interfaces";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface SkillsSectionProps {
  skills: Skill[];
  onSkillsChange: (newSkills: Skill[]) => void;
  errorSkillsSection: ZodError | null;
}

export function SkillsSection({
  skills,
  onSkillsChange,
  errorSkillsSection,
}: SkillsSectionProps) {
  const [currentSkill, setCurrentSkill] = useState("");
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [skillType, setSkillType] = useState<"TECHNICAL" | "SOFT">("TECHNICAL");
  const [error, setError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch skills from the API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("/skills");
        setAllSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setAllSkills([]);
      }
    };

    fetchSkills();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentSkill(value);
    setError(null);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter skills based on input and current skill type
    const filteredSkills = allSkills.filter(
      (skill) =>
        skill.type === skillType &&
        (skill.name.toLowerCase().includes(value.toLowerCase()) ||
          skill.aliases.some((alias: string) =>
            alias.toLowerCase().includes(value.toLowerCase()),
          )),
    );

    // Limit to 10 suggestions for better UX
    setSuggestions(filteredSkills.slice(0, 10));
    setShowSuggestions(filteredSkills.length > 0);
  };

  const handleAddSkill = () => {
    // Check if skill exists in the database and matches the current skill type
    const matchedSkill = allSkills.find(
      (skill) =>
        skill.type === skillType &&
        (skill.name.toLowerCase() === currentSkill.toLowerCase() ||
          skill.aliases.some(
            (alias: string) =>
              alias.toLowerCase() === currentSkill.toLowerCase(),
          )),
    );

    if (matchedSkill) {
      // Count how many skills of this type are already selected
      const skillsOfCurrentType = skills.filter((s) => s.type === skillType);

      // Check maximum 3 skills per type (total 5 max)
      if (skillsOfCurrentType.length >= 3) {
        setError(
          `Vous ne pouvez sélectionner que 3 ${
            skillType === "TECHNICAL" ? "compétences techniques" : "soft skills"
          } maximum.`,
        );
        return;
      }

      // Check if the skill is already in the list
      if (!skills.some((s) => s.name === matchedSkill.name)) {
        onSkillsChange([...skills, matchedSkill]);
        setCurrentSkill("");
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        setError("Cette compétence est déjà dans votre liste.");
      }
    } else if (currentSkill.trim() !== "") {
      setError("Cette compétence n'existe pas dans notre base de données.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    onSkillsChange(updatedSkills);
  };

  const handleSelectSuggestion = (skill: Skill) => {
    // Count how many skills of this type are already selected
    const skillsOfCurrentType = skills.filter((s) => s.type === skill.type);

    // Check maximum 3 skills per type (total 5 max)
    if (skillsOfCurrentType.length >= 3) {
      setError(
        `Vous ne pouvez sélectionner que 3 ${
          skill.type === "TECHNICAL" ? "compétences techniques" : "soft skills"
        } maximum.`,
      );
      return;
    }

    // Check if the skill is already in the list
    if (!skills.some((s) => s.name === skill.name && s.type === skill.type)) {
      onSkillsChange([...skills, skill]);
      setCurrentSkill("");
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
    } else {
      setError("Cette compétence est déjà dans votre liste.");
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get counts for each type of skill
  const technicalSkillsCount = skills.filter(
    (s) => s.type === "TECHNICAL",
  ).length;
  const softSkillsCount = skills.filter((s) => s.type === "SOFT").length;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex flex-col justify-center items-center gap-5 self-stretch">
        <p
          className={`${montserrat.className} text-black text-center text-lg font-medium`}
        >
          Vos compétences (maximum 5)
          <br />
          (les recruteurs vous trouveront via ces informations)
        </p>

        {/* Skill Type Selector */}
        <div className="flex items-center gap-4 w-full pb-2">
          <button
            onClick={() => setSkillType("TECHNICAL")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              skillType === "TECHNICAL"
                ? "bg-freehunt-main text-white"
                : "bg-gray-100 text-freehunt-black-two"
            }`}
          >
            Compétences techniques ({technicalSkillsCount}/3)
          </button>
          <button
            onClick={() => setSkillType("SOFT")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              skillType === "SOFT"
                ? "bg-freehunt-main text-white"
                : "bg-gray-100 text-freehunt-black-two"
            }`}
          >
            Soft skills ({softSkillsCount}/3)
          </button>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2 w-full">
            <Input
              type="text"
              className="flex-1 h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
              value={currentSkill}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Ajouter une ${
                skillType === "TECHNICAL"
                  ? "compétence technique"
                  : "soft skill"
              }`}
              disabled={
                skills.length >= 5 ||
                (skillType === "TECHNICAL" && technicalSkillsCount >= 3) ||
                (skillType === "SOFT" && softSkillsCount >= 3)
              }
            />
            <Button
              onClick={handleAddSkill}
              disabled={
                currentSkill.trim() === "" ||
                skills.length >= 5 ||
                (skillType === "TECHNICAL" && technicalSkillsCount >= 3) ||
                (skillType === "SOFT" && softSkillsCount >= 3)
              }
              className="h-10 px-4 rounded-lg bg-freehunt-main text-white"
            >
              +
            </Button>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute mt-12 w-[calc(100%-5rem)] bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10"
            >
              {suggestions.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(skill)}
                >
                  <span className="text-freehunt-black-two">{skill.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display selected skills by category */}
        <div className="flex flex-col w-full gap-4">
          {/* Technical Skills */}
          {skills.filter((s) => s.type === "TECHNICAL").length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium text-freehunt-black-two">
                Compétences techniques :
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((skill) => skill.type === "TECHNICAL")
                  .map((skill, index) => (
                    <div
                      key={`tech-${index}`}
                      className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1"
                    >
                      <span className="text-freehunt-black-two text-sm">
                        {skill.name}
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveSkill(
                            skills.findIndex((s) => s.name === skill.name),
                          )
                        }
                        className="text-red-500 text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {skills.filter((s) => s.type === "SOFT").length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium text-freehunt-black-two">
                Soft skills :
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((skill) => skill.type === "SOFT")
                  .map((skill, index) => (
                    <div
                      key={`soft-${index}`}
                      className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1"
                    >
                      <span className="text-freehunt-black-two text-sm">
                        {skill.name}
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveSkill(
                            skills.findIndex((s) => s.name === skill.name),
                          )
                        }
                        className="text-red-500 text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {errorSkillsSection && (
          <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
            <p
              className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
            >
              {
                errorSkillsSection.errors.find(
                  (error: ZodIssue) => error.path[0] === "skills",
                )?.message
              }
            </p>
          </div>
        )}
      </div>
      <TipBox content="Sélectionnez un équilibre entre compétences techniques et soft skills pour vous démarquer auprès des recruteurs !" />
    </div>
  );
}
