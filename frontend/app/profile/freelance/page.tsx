"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, TrendingUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillsSection } from "@/components/register/form/SkillSection";
import { Skill } from "@/lib/interfaces";
import { z } from "zod";

interface Freelance {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  averageDailyRate: number;
  seniority: number;
  location: string;
  stripeAccountId?: string;
  userId: string;
  skills: Skill[];
}

interface User {
  id: string;
  email: string;
  username: string;
  role: "FREELANCE" | "COMPANY";
  freelance?: Freelance;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  userId: string;
  createdAt?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  location: string;
  jobTitle: string;
  seniority: number;
  averageDailyRate: number;
  stripeAccountId: string;
  skills: Skill[];
  avatar: File | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const DEFAULT_AVATAR_URL = "../assets/logo.jpg";

const freelanceSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit faire au moins 2 caractères"), 
  location: z.string().min(2, "Le lieu doit faire au moins 2 caractères"),
  jobTitle: z.string().min(2, "Le poste doit faire au moins 2 caractères"),
  seniority: z.number().min(0, "L'expérience doit être supérieure ou égale à 0"),
  averageDailyRate: z.number().min(1, "Le TJM doit être supérieur à 0"),
  stripeAccountId: z.string().optional(),
});

type FreelanceFormErrors = Partial<
  Record<keyof z.infer<typeof freelanceSchema>, string>
>;

export default function FreelanceProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [freelance, setFreelance] = useState<Freelance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FreelanceFormErrors>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorSkillsSection, setErrorSkillsSection] = useState<z.ZodError | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    location: "",
    jobTitle: "",
    seniority: 0,
    averageDailyRate: 0,
    stripeAccountId: "",
    skills: [],
    avatar: null,
  });

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/getme`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      }

      const userData: User = await response.json();
      
      if (userData.role !== "FREELANCE") {
        router.push("/");
        return;
      }

      setUser(userData);
            
      if (userData.freelance) {
        setFreelance(userData.freelance);
        setFormData({
          firstName: userData.freelance.firstName || "",
          lastName: userData.freelance.lastName || "",
          location: userData.freelance.location || "",
          jobTitle: userData.freelance.jobTitle || "",
          seniority: userData.freelance.seniority || 0,
          averageDailyRate: userData.freelance.averageDailyRate || 0,
          stripeAccountId: userData.freelance.stripeAccountId || "",
          skills: userData.freelance.skills || [],
          avatar: null,
        });

        await fetchFreelanceAvatar(userData.id);
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          location: "",
          jobTitle: "",
          seniority: 0,
          averageDailyRate: 0,
          stripeAccountId: "",
          skills: [],
          avatar: null,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchFreelanceAvatar = async (userId: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/upload?userId=${userId}&type=AVATAR`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const documents: Document[] = await response.json();

        if (documents.length > 0) {
          const sortedDocuments = documents.sort(
            (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
          );
          const latestDocument = sortedDocuments[0];
          setAvatarUrl(latestDocument.url);
        } else {
          setAvatarUrl(null);
        }
      }
    } catch (err) {
      setError("Erreur lors de la récupération de l'avatar");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'seniority' || name === 'averageDailyRate' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSkillsChange = (newSkills: Skill[]) => {
    setFormData((prev) => ({ ...prev, skills: newSkills }));
    setErrorSkillsSection(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. Taille maximale: 5MB.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar = async (
    avatar: File,
    userId: string,
  ): Promise<string | null> => {
    try {
      const fileFormData = new FormData();
      fileFormData.append("file", avatar);

      const uploadResponse = await fetch(
        `${BACKEND_URL}/upload/avatar/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
          body: fileFormData,
        },
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error("Erreur lors de l'upload de l'avatar");
      }

      const uploadData = await uploadResponse.json();
      return uploadData.url;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Erreur: utilisateur non identifié");
      return;
    }

    const result = freelanceSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FreelanceFormErrors = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof FreelanceFormErrors;
        fieldErrors[fieldName] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});

    try {
      let newAvatarUrl = avatarUrl;
      if (formData.avatar) {
        newAvatarUrl = await uploadAvatar(formData.avatar, user.id);
        setAvatarUrl(newAvatarUrl);
        setAvatarPreview(null);
      }

      const skillIds = formData.skills.map(skill => skill.id);

      let response: Response;

      if (freelance) {
        response = await fetch(`${BACKEND_URL}/freelances/${freelance.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            location: formData.location,
            jobTitle: formData.jobTitle,
            seniority: formData.seniority,
            averageDailyRate: formData.averageDailyRate,
            stripeAccountId: formData.stripeAccountId || undefined,
            skillIds: skillIds,
          }),
        });
      } else {
        response = await fetch(`${BACKEND_URL}/freelances`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            location: formData.location,
            jobTitle: formData.jobTitle,
            seniority: formData.seniority,
            averageDailyRate: formData.averageDailyRate,
            stripeAccountId: formData.stripeAccountId || undefined,
            userId: user.id,
            skillIds: skillIds,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedFreelance: Freelance = await response.json();
      setFreelance(updatedFreelance);

      setFormData((prev) => ({ ...prev, avatar: null }));

      alert("Profil mis à jour avec succès !");
    } catch (err: any) {
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <Button
            onClick={fetchCurrentUser}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "FREELANCE") {
    return null;
  }

  const displayAvatar = avatarPreview || avatarUrl || DEFAULT_AVATAR_URL;
  const displayName = `${formData.firstName || freelance?.firstName || ''} ${formData.lastName || freelance?.lastName || ''}`.trim() || user.username;

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              
            {/* Card Profil */}
            <Card className="overflow-hidden py-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex-shrink-0 overflow-hidden">
                    <img 
                      src={displayAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {displayName}
                    </h3>
                    <Badge className="text-white" style={{backgroundColor: '#FF4D6D'}}>
                      Freelance
                    </Badge>
                    <p className="text-gray-600 my-2">
                      {formData.jobTitle || freelance?.jobTitle || "Poste non renseigné"}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {formData.location || freelance?.location || "Lieu non renseigné"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Compétences */}
            <Card className="p-0">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <SkillsSection
                    skills={formData.skills}
                    onSkillsChange={handleSkillsChange}
                    errorSkillsSection={errorSkillsSection}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card Statistiques */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Statistiques</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Année</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Revenus de cette année</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">€108.9k</span>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>2.3%</span>
                    </div>
                  </div>
                </div>

                {/* Graphique simulé */}
                <div className="relative h-48 bg-gradient-to-t from-purple-200 to-purple-100 rounded-lg overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <path
                      d="M0,120 Q50,100 100,110 T200,90 T300,70 T400,80"
                      fill="none"
                      stroke="rgb(147, 51, 234)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,120 Q50,100 100,110 T200,90 T300,70 T400,80 L400,200 L0,200 Z"
                      fill="url(#gradient)"
                      fillOpacity="0.3"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.4}} />
                        <stop offset="100%" style={{stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.1}} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Point avec tooltip */}
                  <div className="absolute top-6 right-16">
                    <div className="bg-black text-white px-3 py-2 rounded-lg text-sm relative">
                      <span className="text-xs text-gray-300">807 missions</span>
                      <br />
                      <span className="font-semibold">€5,569</span>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Labels des mois */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card formulaire informations */}
          <div className="space-y-6">
            <Card className='p-0'>
              <div className="px-6 py-4 rounded-t-xl" style={{backgroundColor: '#FF4D6D'}}>
                <h2 className="text-white font-semibold text-lg">Informations</h2>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Section Avatar */}
                <div className="space-y-2">
                  <Label>Photo de profil</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                      <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAvatarClick}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-pink-500 hover:bg-pink-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.avatar
                          ? "Changer la photo"
                          : "Télécharger une photo"}
                      </Button>
                    </div>
                  </div>
                  {formData.avatar && (
                    <p className="text-sm text-gray-600">
                      Fichier sélectionné: {formData.avatar.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Prénom
                  </Label>
                  <Input 
                    id="firstName" 
                    name='firstName'
                    type="text" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.firstName ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Nom
                  </Label>
                  <Input 
                    id="lastName" 
                    name='lastName'
                    type="text" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.lastName ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Lieu
                  </Label>
                  <Input 
                    id="location" 
                    name='location'
                    type="text" 
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.location ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.location && (
                    <p className="text-sm text-red-600">{formErrors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                    Poste
                  </Label>
                  <Input 
                    id="jobTitle" 
                    name='jobTitle'
                    type="text" 
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.jobTitle ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.jobTitle && (
                    <p className="text-sm text-red-600">{formErrors.jobTitle}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seniority" className="text-sm font-medium text-gray-700">
                    Expérience (années)
                  </Label>
                  <Input 
                    id="seniority" 
                    name='seniority'
                    type="number" 
                    min="0"
                    value={formData.seniority}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.seniority ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.seniority && (
                    <p className="text-sm text-red-600">{formErrors.seniority}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageDailyRate" className="text-sm font-medium text-gray-700">
                    TJM (€)
                  </Label>
                  <Input 
                    id="averageDailyRate"
                    name='averageDailyRate'
                    type="number" 
                    min="1"
                    step="0.01"
                    value={formData.averageDailyRate}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.averageDailyRate ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.averageDailyRate && (
                    <p className="text-sm text-red-600">{formErrors.averageDailyRate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripeAccountId" className="text-sm font-medium text-gray-700">
                    Id Stripe
                  </Label>
                  <Input 
                    id="stripeAccountId" 
                    name='stripeAccountId'
                    type="text" 
                    value={formData.stripeAccountId}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="w-full max-w-2xl text-white font-bold p-6"
            style={{ backgroundColor: '#FF4D6D' }}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div> 
    </form>
  );
};