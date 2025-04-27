"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../common/multi-select";
import { DatePicker } from "../common/date-picker";

type Step = {
  id: string;
  label: string;
};

export default function MultiStepForm() {
  const steps: Step[] = [
    { id: "job", label: "Le job" },
    { id: "profile", label: "Le profil idéal" },
    { id: "steps", label: "Les étapes clés" },
    { id: "summary", label: "Récapitulatif" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Progress indicator */}
      <div className="bg-freehunt-main rounded-full p-1 flex gap-0.5 shadow-sm">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-1 text-center p-2 rounded-full font-medium duration-300 truncate ${
              index === currentStep
                ? "bg-white text-freehunt-black-two"
                : "text-white hover:bg-freehunt-grey-light hover:text-freehunt-black-two cursor-pointer"
            }`}
            onClick={() => setCurrentStep(index)}
          >
            {step.label}
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="rounded-lg p-6 shadow-md mb-6">
        {/* Step One */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-8">
            {/* Input Job */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-freehunt-main">
                  Nom du job
                </h2>
                <p className="text-gray-400">
                  Veuillez entrer le titre du poste.
                </p>
              </div>
              <Input
                className="text-freehunt-main rounded-full"
                placeholder="Exemple : Développeur Front-End React"
              />
            </div>

            {/* Input Description */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-freehunt-main">
                  Description
                </h2>
                <p className="text-gray-400">
                  Détaillez davantage ici ce que vous cherchez, les missions
                  attendues et les livrables, etc.
                </p>
              </div>
              <Textarea
                className="w-full p-2 border rounded-xl h-32"
                placeholder="Exemple : Nous recherchons un développeur Front-End React pour accompagner la refonte de notre site e-commerce. Le freelance devra collaborer avec notre UX designer et intégrer les maquettes Figma."
              ></Textarea>
            </div>
          </div>
        )}

        {/* Step Two */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-8">
            {/* Input Compétences */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-freehunt-main">
                  Compétences
                </h2>
                <p className="text-gray-400">
                  Sélectionnez les compétences techniques nécessaires à la
                  réalisation de la mission.
                </p>
              </div>
              <MultiSelect />
            </div>

            {/* Input TJM */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-freehunt-main">
                  Tarif souhaité (€/jour)
                </h2>
                <p className="text-gray-400">
                  Indiquez le budget journalier que vous êtes prêt à allouer à
                  cette mission.
                </p>
              </div>
              <Input
                className="text-freehunt-main rounded-full"
                placeholder="Exemple : 500 €/jour"
                type="number"
              />
            </div>

            <div className="flex gap-24">
              {/* Input Date de Début */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-freehunt-main">
                    Date de début
                  </h2>
                  <p className="text-gray-400">
                    Sélectionnez une date de début de mission.
                  </p>
                </div>
                <DatePicker />
              </div>

              {/* Input Date de Début */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-freehunt-main">
                    Date de fin (optionnelle)
                  </h2>
                  <p className="text-gray-400">
                    Sélectionnez une date de fin de mission.
                  </p>
                </div>
                <DatePicker />
              </div>
            </div>

            {/* Input Type de Présence */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-freehunt-main">
                  Type de Présence
                </h2>
                <p className="text-gray-400">
                  Quel mode de travail est attendu pour cette mission ?
                </p>
              </div>
              <Textarea
                className="w-full p-2 border rounded-xl h-32"
                placeholder="Exemple : Nous recherchons un développeur Front-End React pour accompagner la refonte de notre site e-commerce. Le freelance devra collaborer avec notre UX designer et intégrer les maquettes Figma."
              ></Textarea>
            </div>
          </div>
        )}

        {/* Step Three */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Les étapes clés du projet
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date de début
                </label>
                <input type="date" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Étapes principales
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Listez les étapes clés du projet..."
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Step Four */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            <p className="text-gray-600 mb-4">
              Veuillez vérifier toutes les informations avant de soumettre votre
              formulaire.
            </p>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-medium">
                Toutes les informations sont correctes ?
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
        >
          Précédent
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={goToNextStep}>Suivant</Button>
        ) : (
          <Button>Soumettre</Button>
        )}
      </div>
    </div>
  );
}
