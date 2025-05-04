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
import { MapPin, Building, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkillBadge } from "@/components/freelance/skill-badge";
import { JobPosting, JobPostingLocation } from "@/lib/interfaces";
import { formatNumberToEuros } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const getLocationText = (location: JobPostingLocation): string => {
  switch (location) {
    case JobPostingLocation.ONSITE:
      return "Sur site";
    case JobPostingLocation.REMOTE:
      return "Télétravail";
    case JobPostingLocation.HYBRID:
      return "Hybride";
    default:
      return location;
  }
};

function JobPostingCard(jobPosting: JobPosting) {
  const {
    title,
    company,
    location,
    skills,
    averageDailyRate,
    seniority,
    isPromoted,
  } = jobPosting;

  const getCompanyInitials = () => {
    return company?.name ? company.name.substring(0, 2).toUpperCase() : "CO";
  };

  return (
    <Card className="w-full max-w-[340px] rounded-[30px] pb-0 shadow-none flex flex-col relative">
      {isPromoted && (
        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 font-semibold z-10">
          <Star size={12} className="mr-1" /> Promu
        </Badge>
      )}
      <CardHeader className="flex-shrink-0">
        <div className="flex">
          <Avatar className="w-14 h-14 mr-5 flex-shrink-0">
            {/* TODO: Add company logo if available */}
            <AvatarFallback>{getCompanyInitials()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0">
            <CardTitle className="text-lg text-freehunt-black-two pb-1 break-words line-clamp-2 hyphens-auto">
              {title}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1.5">
              {company && (
                <div className="flex items-center gap-1 min-w-0">
                  <Building size={14} className="text-gray-500 flex-shrink-0" />
                  <p className="text-gray-600 font-medium truncate">
                    {company.name}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-1 min-w-0">
                <MapPin
                  size={14}
                  className="text-freehunt-main flex-shrink-0"
                />
                <p className="text-freehunt-main truncate">
                  {getLocationText(location)}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Expérience: {seniority} an{seniority > 1 ? "s" : ""}
              </p>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-grow">
        <div className="flex flex-wrap gap-2 items-start">
          {skills && skills.length > 0 ? (
            skills
              .slice(0, 5)
              .map((skill) => (
                <SkillBadge key={skill.id}>{skill.name}</SkillBadge>
              ))
          ) : (
            <p className="text-sm text-gray-400 italic">
              Aucune compétence listée
            </p>
          )}
          {skills && skills.length > 5 && (
            <Badge
              variant="outline"
              className="text-xs py-0.5 px-2.5 flex items-center justify-center"
            >
              +{skills.length - 5} autres
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-freehunt-main p-6 rounded-b-[30px] mt-4 flex-shrink-0">
        <CardAction className="flex flex-1 justify-between items-center">
          <p className="text-white">
            <strong>{formatNumberToEuros(averageDailyRate)}</strong> / jour
          </p>
          {/* TODO: Link this button to the job posting details page */}
          <Button theme="secondary" className="font-semibold">
            Voir l&apos;offre
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export { JobPostingCard };
