"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/common/button";
import { Freelance } from "@/lib/interfaces";
import { getFreelanceById } from "@/actions/freelances";
import { useAuth } from "@/actions/auth";
import { User, MapPin, DollarSign, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ContactUserButton from "@/components/common/ContactUserButton";

export default function FreelanceProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [freelance, setFreelance] = useState<Freelance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelance = async () => {
      try {
        setLoading(true);
        const data = await getFreelanceById(params.id as string);
        setFreelance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFreelance();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="px-4 lg:px-5 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-5 py-6">
        <div className="bg-white rounded-[30px] border border-freehunt-grey p-12 text-center">
          <h3 className="text-lg font-bold text-freehunt-black-two mb-2">Erreur</h3>
          <p className="text-freehunt-black-two opacity-70 mb-4">{error}</p>
          <Button variant="outline" theme="secondary" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  if (!freelance) {
    return null;
  }

  return (
    <div className="px-4 lg:px-5 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" theme="secondary" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        <div className="bg-white rounded-[30px] border border-freehunt-grey overflow-hidden">
          <div className="bg-gradient-to-r from-freehunt-main/10 to-freehunt-main/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-freehunt-black-two mb-2">
                  {freelance.firstName} {freelance.lastName}
                </h1>
                <p className="text-lg text-freehunt-black-two opacity-80 mb-2">{freelance.jobTitle}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-freehunt-black-two opacity-70">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {freelance.user?.username}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {freelance.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {freelance.averageDailyRate}€/jour
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {freelance.seniority} ans d&apos;expérience
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Description */}
            {freelance.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-freehunt-black-two mb-3">À propos</h3>
                <p className="text-freehunt-black-two opacity-70 leading-relaxed">{freelance.description}</p>
              </div>
            )}

            {/* Compétences */}
            {freelance.skills && freelance.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-freehunt-black-two mb-3">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {freelance.skills.map((skill) => (
                    <Badge key={skill.id} className="bg-freehunt-main/10 text-freehunt-black-two border-freehunt-main/20">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-freehunt-grey flex gap-3">
              <ContactUserButton
                currentUserId={user?.id || ""}
                targetUserId={freelance.userId}
                targetUserName={`${freelance.firstName} ${freelance.lastName}`}
                buttonText="Contacter ce freelance"
                size="default"
              />
              <Button variant="outline" theme="secondary" asChild>
                <Link href={`/freelances`}>
                  Voir d&apos;autres freelances
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
