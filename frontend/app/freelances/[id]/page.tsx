"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Freelance } from "@/lib/interfaces";
import { getFreelanceById } from "@/actions/freelances";
import { User, MapPin, DollarSign, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FreelanceProfilePage() {
  const params = useParams();
  const router = useRouter();
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
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!freelance) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {freelance.firstName} {freelance.lastName}
                </CardTitle>
                <p className="text-lg text-gray-700 mb-2">{freelance.jobTitle}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
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
          </CardHeader>

          <CardContent className="p-6">
            {/* Description */}
            {freelance.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">À propos</h3>
                <p className="text-gray-700 leading-relaxed">{freelance.description}</p>
              </div>
            )}

            {/* Compétences */}
            {freelance.skills && freelance.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {freelance.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t flex gap-3">
              <Button asChild>
                <Link href={`/messages?freelanceId=${freelance.id}`}>
                  Contacter ce freelance
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/freelances`}>
                  Voir d&apos;autres freelances
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
