import { useState, useEffect, ChangeEvent } from "react";
import { CompanyFormData, CompanyBlurStates } from "@/actions/register";
import { z } from "zod";

export function useCompanyFormData() {
  const schemaFirstSection = z.object({
    name: z.string().min(1, "Le nom est obligatoire"),
    siren: z.string().min(9, "Le numéro de Siren est obligatoire"),
  });

  const schemaSecondSection = z.object({
    address: z.string().min(1, "L'adresse est obligatoire"),
  });

  const schemaThirdSection = z.object({
    description: z.string().min(1, "La description est obligatoire"),
  });

  const schemaFourthSection = z.object({
    logo: z.any().refine(
      (file) => {
        if (typeof window === "undefined") return true;
        return file instanceof File && file.size > 0;
      },
      {
        message: "Le logo est obligatoire",
      },
    ),
  });

  const schema = [
    schemaFirstSection,
    schemaSecondSection,
    schemaThirdSection,
    schemaFourthSection,
  ];
  const [errorNameSection, setErrorNameSection] = useState<z.ZodError | null>(
    null,
  );
  const [errorSirenSection, setErrorSirenSection] = useState<z.ZodError | null>(
    null,
  );
  const [errorAddressSection, setErrorAddressSection] =
    useState<z.ZodError | null>(null);
  const [errorDescriptionSection, setErrorDescriptionSection] =
    useState<z.ZodError | null>(null);
  const [errorLogoSection, setErrorLogoSection] = useState<z.ZodError | null>(
    null,
  );

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    siren: "",
    description: "",
    address: "",
    logo: null,
  });

  const [companyBlurStates, setCompanyBlurStates] = useState<CompanyBlurStates>(
    {
      isNameBlurred: true,
      isSirenBlurred: true,
      isDescriptionBlurred: true,
      isAddressBlurred: true,
      isLogoBlurred: true,
    },
  );

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    setErrorNameSection(null);
  };

  const handleSirenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, siren: e.target.value });
    setErrorSirenSection(null);
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, address: e.target.value });
    setErrorAddressSection(null);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
    setErrorDescriptionSection(null);
  };

  const handleLogoChange = (file: File) => {
    setFormData({ ...formData, logo: file });
    setErrorLogoSection(null);
  };

  // Mise à jour des états de floutage
  useEffect(() => {
    setCompanyBlurStates({
      isNameBlurred: formData.name.trim() === "",
      isSirenBlurred: formData.siren.trim() === "",
      isDescriptionBlurred: formData.description.trim() === "",
      isAddressBlurred: formData.address.trim() === "",
      isLogoBlurred: formData.logo === null,
    });
  }, [formData]);

  return {
    formData,
    companyBlurStates,
    errorNameSection,
    errorSirenSection,
    errorAddressSection,
    errorDescriptionSection,
    errorLogoSection,
    schema,
    handleNameChange,
    handleSirenChange,
    handleAddressChange,
    handleDescriptionChange,
    handleLogoChange,
    setErrorNameSection,
    setErrorSirenSection,
    setErrorAddressSection,
    setErrorDescriptionSection,
    setErrorLogoSection,
  };
}
