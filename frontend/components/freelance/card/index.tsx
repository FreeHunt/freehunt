import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/common/button";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkillBadge } from "../skill-badge";
import { Freelance } from "@/lib/interfaces";
import { formatNumberToEuros } from "@/lib/utils";

function FreelanceCard(freelance: Freelance) {
  const { firstName, lastName, jobTitle, skills, averageDailyRate } = freelance;

  const getInitials = () => {
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

  return (
    <Card className="w-[340px] rounded-[30px] pb-0 shadow-none">
      <CardHeader>
        <div className="flex">
          {/* Avatar */}
          <Avatar className="w-14 h-14 mr-5">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>

          {/* General information */}
          <div className="flex flex-col">
            <CardTitle className="text-lg text-freehunt-black-two pb-2">
              {firstName} {lastName}
            </CardTitle>
            <CardDescription className="flex flex-col gap-3">
              <p className="text-freehunt-black-two font-medium">{jobTitle}</p>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-freehunt-main" />
                <p className="text-freehunt-main">Paris, France</p>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex gap-2.5 flex-wrap flex-1">
        {/* Skills */}
        {skills.length > 0 &&
          skills.map((skill) => (
            <SkillBadge key={skill.id}>{skill.name}</SkillBadge>
          ))}
      </CardContent>

      <CardFooter className="bg-freehunt-main p-6 rounded-b-[30px]">
        <CardAction className="flex flex-1 justify-between items-center">
          <p className="text-white">
            <strong>{formatNumberToEuros(averageDailyRate)}</strong> / jour
          </p>
          <Button theme="secondary" className="font-semibold">
            Voir le profil
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export { FreelanceCard };
