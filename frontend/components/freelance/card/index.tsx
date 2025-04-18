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

function FreelanceCard() {
  return (
    <Card className="w-[340px] rounded-[30px] pb-0">
      <CardHeader>
        <div className="flex">
          {/* Avatar */}
          <Avatar className="w-14 h-14 mr-5">
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>

          {/* General information */}
          <div className="flex flex-col">
            <CardTitle className="text-lg text-freehunt-black-two pb-2">
              Fanny Blas
            </CardTitle>
            <CardDescription className="flex flex-col gap-3">
              <p className="text-freehunt-black-two font-medium">
                Développeur backend
              </p>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-freehunt-main" />
                <p className="text-freehunt-main">Paris, France</p>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex gap-2.5 flex-wrap">
        <SkillBadge>Python</SkillBadge>
        <SkillBadge>Python</SkillBadge>
      </CardContent>

      <CardFooter className="bg-freehunt-main p-6 rounded-b-[30px]">
        <CardAction className="flex flex-1 justify-between items-center">
          <p className="text-white">
            <strong>500 €</strong> / jour
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
