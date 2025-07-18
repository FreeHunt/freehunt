"use client";

import { Button } from "@/components/common/button";
import { SkillBadge } from "@/components/freelance/skill-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobPosting, JobPostingLocation } from "@/lib/interfaces";
import { formatNumberToEuros } from "@/lib/utils";
import { Building, MapPin, Star } from "lucide-react";
import { useRouter } from "next/navigation";
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
    recommended,
  } = jobPosting;

  const getCompanyInitials = () => {
    return company?.name ? company.name.substring(0, 2).toUpperCase() : "CO";
  };

  const router = useRouter();

  return (
    <Card className="w-full max-w-[340px] rounded-xl pb-0 shadow-none flex flex-col relative">
      {recommended && (
        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 font-semibold z-10 rounded-md p-1">
          <Star size={12} />
        </Badge>
      )}
      <CardHeader className="flex-shrink-0">
        <div className="flex flex-wrap">
          <Avatar className="w-14 h-14 mr-5 flex-shrink-0">
            {/* TODO: Add company logo if available */}
            <AvatarFallback>{getCompanyInitials()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0">
            <CardTitle className="text-lg text-freehunt-black-two pb-1 break-words line-clamp-2 hyphens-auto max-w-[200px]">
              {title}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1.5 max-w-[200px]">
              {company && (
                <div className="flex items-center gap-1 min-w-0">
                  <Building size={14} className="text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground font-medium truncate max-w-[170px]">
                    {company.name}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-1 min-w-0">
                <MapPin
                  size={14}
                  className="text-freehunt-main flex-shrink-0"
                />
                <p className="text-freehunt-main truncate max-w-[170px]">
                  {getLocationText(location)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
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
            <p className="text-sm text-muted-foreground italic">
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

      <CardFooter className="bg-freehunt-main p-6 rounded-b-xl mt-4 flex-shrink-0">
        <CardAction className="flex flex-1 justify-between items-center">
          <p className="text-white">
            <strong>{formatNumberToEuros(averageDailyRate)}</strong> / jour
          </p>
          {/* TODO: Link this button to the job posting details page */}
          <Button
            theme="secondary"
            className="font-semibold"
            onClick={() => router.push(`/job-postings/${jobPosting.id}`)}
          >
            Voir l&apos;offre
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export { JobPostingCard };
