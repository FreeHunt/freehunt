import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";

interface CompanyLogoSectionProps {
  onLogoChange: (fileUrl: string) => void;
}

export function CompanyLogoSection({ onLogoChange }: CompanyLogoSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ici on on devra stoqué l'url de l'image 
      // avec l'alternative AWS épinglée sur discord  
      
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      onLogoChange(fileUrl);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-4">
        <Label htmlFor="companyLogo">Logo de l'entreprise</Label>
        
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 rounded-md overflow-hidden">
              <img 
                src={preview} 
                alt="Logo preview" 
                className="w-full h-full object-cover" 
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => document.getElementById("companyLogo")?.click()}
            >
              Changer le logo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-48 h-48 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50 cursor-pointer"
              onClick={() => document.getElementById("companyLogo")?.click()}
            >
              <ImageIcon size={64} className="text-gray-300" />
            </div>
            <Button 
              variant="outline"
              onClick={() => document.getElementById("companyLogo")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Télécharger un logo
            </Button>
          </div>
        )}
        
        <input
          id="companyLogo"
          type="file"
          accept="image/*" 
          className="hidden"
          onChange={handleFileChange}
        />
        
        <p className="text-sm text-gray-500">
          Formats acceptés : JPG, PNG. Taille maximale : 2 MB.
        </p>
      </div>
    </div>
  );
}