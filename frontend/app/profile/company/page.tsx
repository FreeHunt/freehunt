"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, TrendingUp, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

interface Company {
  id: string;
  name: string;
  address: string;
  siren: string;
  description: string;
  userId: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "FREELANCE" | "COMPANY";
  company?: Company;
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
  name: string;
  address: string;
  siren: string;
  description: string;
  logo: File | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const DEFAULT_LOGO_URL = "../assets/logo.jpg";

const companySchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  address: z.string().min(5, "L'adresse doit faire au moins 5 caractères"),
  siren: z
    .string()
    .regex(/^\d{9}$/, "Le numéro SIREN doit comporter exactement 9 chiffres"),
  description: z
    .string()
    .min(10, "La description doit faire au moins 10 caractères"),
});

type CompanyFormErrors = Partial<
  Record<keyof z.infer<typeof companySchema>, string>
>;

export default function CompanyProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<CompanyFormErrors>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    siren: "",
    description: "",
    logo: null,
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
      
      if (userData.role !== "COMPANY") {
        router.push("/");
        return;
      }

      setUser(userData);

      if (userData.company) {
        setCompany(userData.company);
        setFormData({
          name: userData.company.name || "",
          address: userData.company.address || "",
          siren: userData.company.siren || "",
          description: userData.company.description || "",
          logo: null,
        });

        // Récupérer le logo de l'entreprise
        await fetchCompanyLogo(userData.id);
      } else {
        setFormData({
          name: "",
          address: "",
          siren: "",
          description: "",
          logo: null,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyLogo = async (userId: string) => {
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
          setLogoUrl(latestDocument.url);
        } else {
          setLogoUrl(null);
        }
      }
    } catch (err) {
      setError("Erreur lors de la récupération du logo");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image.");
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. Taille maximale: 5MB.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const uploadLogo = async (
    logo: File,
    userId: string,
  ): Promise<string | null> => {
    try {
      const fileFormData = new FormData();
      fileFormData.append("file", logo);

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
        throw new Error("Erreur lors de l'upload du logo");
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

    const result = companySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: CompanyFormErrors = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof CompanyFormErrors;
        fieldErrors[fieldName] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setFormErrors({});

    try {
      let newLogoUrl = logoUrl;
      if (formData.logo) {
        newLogoUrl = await uploadLogo(formData.logo, user.id);
        setLogoUrl(newLogoUrl);
        setLogoPreview(null);
      }

      // Mise à jour des informations de l'entreprise
      let response: Response;

      if (company) {
        response = await fetch(`${BACKEND_URL}/companies/${company.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            siren: formData.siren,
            description: formData.description,
          }),
        });
      } else {
        response = await fetch(`${BACKEND_URL}/companies`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            siren: formData.siren,
            description: formData.description,
            userId: user.id,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedCompany: Company = await response.json();
      setCompany(updatedCompany);

      // Réinitialiser le fichier
      setFormData((prev) => ({ ...prev, logo: null }));

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

  if (!user || user.role !== "COMPANY") {
    return null;
  }

  const displayLogo = logoPreview || logoUrl || DEFAULT_LOGO_URL;

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden py-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                    <img
                      src={displayLogo}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {company?.name || formData.name || "Nom de l'entreprise"}
                    </h3>
                    <Badge
                      className=" text-white"
                      style={{ backgroundColor: "#FF4D6D" }}
                    >
                      Entreprise
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm my-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company?.address ||
                        formData.address ||
                        "Adresse non renseignée"}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  {company?.description ||
                    formData.description ||
                    "Description non renseignée"}
                </p>
              </CardContent>
            </Card>
            {/* Statistiques */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Statistiques
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Année</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Dépenses de cette année
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      €245.2k
                    </span>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>5.7%</span>
                    </div>
                  </div>
                </div>
                {/* Graphique simulé */}
                <div className="relative h-48 bg-gradient-to-t from-purple-200 to-purple-100 rounded-lg overflow-hidden">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,140 Q50,120 100,130 T200,110 T300,90 T400,100"
                      fill="none"
                      stroke="rgb(147, 51, 234)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,140 Q50,120 100,130 T200,110 T300,90 T400,100 L400,200 L0,200 Z"
                      fill="url(#gradient)"
                      fillOpacity="0.3"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: "rgb(147, 51, 234)",
                            stopOpacity: 0.4,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: "rgb(147, 51, 234)",
                            stopOpacity: 0.1,
                          }}
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute top-8 right-16">
                    <div className="bg-black text-white px-3 py-2 rounded-lg text-sm relative">
                      <span className="text-xs text-gray-300">142 projets</span>
                      <br />
                      <span className="font-semibold">€18,420</span>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                    {[
                      "JAN",
                      "FEB",
                      "MAR",
                      "APR",
                      "MAY",
                      "JUN",
                      "JUL",
                      "AUG",
                      "SEP",
                      "OCT",
                      "NOV",
                      "DEC",
                    ].map((month) => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-0">
              <div
                className="px-6 py-4 rounded-t-xl"
                style={{ backgroundColor: "#FF4D6D" }}
              >
                <h2 className="text-white font-semibold text-lg">
                  Informations
                </h2>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Section Logo */}
                <div className="space-y-2">
                  <Label>Logo de l'entreprise</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                      <img
                        src={displayLogo}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogoClick}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-pink-500 hover:bg-pink-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.logo
                          ? "Changer le logo"
                          : "Télécharger un logo"}
                      </Button>
                    </div>
                  </div>
                  {formData.logo && (
                    <p className="text-sm text-gray-600">
                      Fichier sélectionné: {formData.logo.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.name ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.address ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-sm text-red-600">{formErrors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siren">Siren</Label>
                  <Input
                    id="siren"
                    name="siren"
                    type="text"
                    value={formData.siren}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 ${
                      formErrors.siren ? "border border-red-500" : "border-0"
                    }`}
                  />
                  {formErrors.siren && (
                    <p className="text-sm text-red-600">{formErrors.siren}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-500 resize-none ${
                      formErrors.description
                        ? "border border-red-500"
                        : "border-0"
                    }`}
                    placeholder="Décrivez votre entreprise..."
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="w-full max-w-2xl text-white font-bold p-6"
            style={{ backgroundColor: "#FF4D6D" }}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </form>
  );
}