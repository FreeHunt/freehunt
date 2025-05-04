import { useState, useEffect, ChangeEvent } from "react";
import { CompanyFormData, CompanyBlurStates } from "@/actions/register";

export function useCompanyFormData() {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    siren: "",
    description: "",
    address: "",
    logo: "",
  });

  const [companyBlurStates, setCompanyBlurStates] = useState<CompanyBlurStates>({
    isNameBlurred: true,
    isSirenBlurred: true,
    isDescriptionBlurred: true,
    isAddressBlurred: true,
    isLogoBlurred: true,
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, name: e.target.value });

  const handleSirenChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, siren: e.target.value });

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, address: e.target.value });

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setFormData({ ...formData, description: e.target.value });

  const handleLogoChange = (fileUrl: string) =>
    setFormData({ ...formData, logo: fileUrl });

  // Mise à jour des états de floutage
  useEffect(() => {
    setCompanyBlurStates({
      isNameBlurred: formData.name.trim() === "",
      isSirenBlurred: formData.siren.trim() === "",
      isDescriptionBlurred: formData.description.trim() === "",
      isAddressBlurred: formData.address.trim() === "",
      isLogoBlurred: formData.logo === "",
    });
  }, [formData]);

  return {
    formData,
    companyBlurStates,
    handleNameChange,
    handleSirenChange,
    handleAddressChange,
    handleDescriptionChange,
    handleLogoChange
  };
}