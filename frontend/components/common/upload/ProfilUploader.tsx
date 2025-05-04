import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@/components/common/icons/PlusIcon";

interface ProfileUploaderProps {
  onFileChange: (file: File) => void;
}

export function ProfileUploader({ onFileChange }: ProfileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="border rounded-full bg-white p-2 flex items-center mb-4">
        <label
          htmlFor="profile-photo"
          className="flex items-center cursor-pointer w-full"
        >
          <div className="bg-red-400 text-white rounded-full p-2 mr-3 flex items-center justify-center w-10 h-10">
            <PlusIcon className="w-6 h-6" />
          </div>
          <span className="text-gray-500">
            Glissez ou sélectionner un fichier ici
          </span>
          <Input
            id="profile-photo"
            type="file"
            accept="image/jpeg, image/png, image/jpg, image/webp"
            className="hidden"
            onChange={handleFileChange}
            multiple={false}
          />
        </label>
      </div>

      <div className="text-gray-400 text-sm">
        <div className="flex gap-2">
          <p className="font-bold">Format :</p> <p>JPEG, PNG</p>
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Dimensions :</p> <p>400px*400px minimum</p>
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Poids :</p> <p>5 Mo maximum</p>
        </div>
      </div>

      {file && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">
            Fichier sélectionné: {file.name}
          </p>
        </div>
      )}
    </div>
  );
}
