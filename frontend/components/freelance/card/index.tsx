import { Button } from "@/components/common/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Freelance } from "@/lib/interfaces";
import { formatNumberToEuros } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { SkillBadge } from "../skill-badge";

function FreelanceCard(freelance: Freelance) {
  const router = useRouter();
  const {
    id,
    firstName,
    lastName,
    location,
    jobTitle,
    skills,
    averageDailyRate,
  } = freelance;

  const getInitials = () => {
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

  const handleViewProfile = () => {
    router.push(`/freelances/${id}`);
  };

  return (
    <Card className="w-[340px] rounded-xl pb-0 shadow-none">
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
            <CardDescription className="flex flex-col gap-3 h-[72px]">
              <p className="text-freehunt-black-two font-medium">{jobTitle}</p>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin size={14} className="text-freehunt-main" />
                <p className="text-freehunt-main w-40 overflow-hidden text-ellipsis">
                  {location}
                </p>
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

      <CardFooter className="bg-freehunt-main p-6 rounded-b-xl">
        <CardAction className="flex flex-1 justify-between items-center">
          <p className="text-white">
            <strong>{formatNumberToEuros(averageDailyRate)}</strong> / jour
          </p>
          <Button
            theme="secondary"
            className="font-semibold"
            onClick={handleViewProfile}
          >
            Voir le profil
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export { FreelanceCard };
