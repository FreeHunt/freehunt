import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/common/button";
import { TipBox } from "@/components/common/banner/TipBox";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface SkillsSectionProps {
  skills: string[];
  onSkillsChange: (newSkills: string[]) => void;
}

export function SkillsSection({ skills, onSkillsChange }: SkillsSectionProps) {
  const [currentSkill, setCurrentSkill] = useState("");

  const handleAddSkill = () => {
    if (currentSkill.trim() !== "" && skills.length < 5) {
      onSkillsChange([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    onSkillsChange(updatedSkills);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="flex flex-col justify-center items-center gap-5 self-stretch">
        <p
          className={`${montserrat.className} text-black text-center text-lg font-medium`}
        >
          Vos compétences (maximum 5)
          <br />
          (les recruteurs vous trouveront via ces informations)
        </p>
        <div className="flex items-center gap-2 w-full">
          <Input
            type="text"
            className="flex-1 h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={currentSkill}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCurrentSkill(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une compétence"
            disabled={skills.length >= 5}
          />
          <Button
            onClick={handleAddSkill}
            disabled={skills.length >= 5 || currentSkill.trim() === ""}
            className="h-10 px-4 rounded-lg bg-freehunt-main text-white"
          >
            +
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1"
              >
                <span className="text-freehunt-black-two text-sm">{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-500 text-sm font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <TipBox content="Plus vous sélectionnerez des compétences pertinentes par rapport à votre expertise principale, plus vous serez mis en avant pour les recruteurs !" />
    </div>
  );
}
