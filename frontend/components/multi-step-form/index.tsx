"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../common/multi-select";
import { DatePicker } from "../common/date-picker";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { JobPostingLocation } from "@/lib/interfaces";

type Step = {
  id: string;
  label: string;
};

type Skill = Record<"value" | "label", string>;

const SKILLS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
  {
    value: "express.js",
    label: "Express.js",
  },
  {
    value: "nest.js",
    label: "Nest.js",
  },
] satisfies Skill[];

const validPresenceForZod = Object.values(JobPostingLocation) as [
  string,
  ...string[],
];

// Définition des schémas Zod pour chaque étape
const jobSchema = z.object({
  jobTitle: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  jobDescription: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères"),
});

const profileSchema = z.object({
  skills: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .nonempty("Au moins une compétence est requise."),
  tjm: z
    .string()
    .min(1, "Le tarif journalier est requis")
    .regex(/^\d+$/, "Le tarif doit être un nombre valide"),
  dateOfStart: z
    .string()
    .min(1, "La date de début est requise")
    .refine(
      (date) => {
        return (
          new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
      },
      {
        message: "La date de début ne peut pas être dans le passé",
      },
    ),
  dateOfEnd: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true; // Si pas de date de fin, pas de validation
        const startDate = new Date(date);
        const endDate = new Date(date);
        return endDate >= startDate;
      },
      {
        message:
          "La date de fin ne peut pas être antérieure à la date de début",
      },
    ),
  typePresence: z
    .string()
    .refine((val) => validPresenceForZod.includes(val), {
      message: "Le type de présence est invalide",
    })
    .refine((val) => val !== "", {
      message: "Le type de présence est requis",
    }),
  experience: z.string(),
});

const projectSchema = z.object({
  startDate: z.string().min(1, "La date de début est requise"),
  projectSteps: z.string().min(1, "Les étapes du projet sont requises"),
});

// Schéma complet du formulaire
const formSchema = z.object({
  jobTitle: jobSchema.shape.jobTitle,
  jobDescription: jobSchema.shape.jobDescription,
  skills: profileSchema.shape.skills,
  tjm: profileSchema.shape.tjm,
  dateOfStart: profileSchema.shape.dateOfStart,
  dateOfEnd: profileSchema.shape.dateOfEnd,
  typePresence: profileSchema.shape.typePresence,
  experience: profileSchema.shape.experience,
  startDate: projectSchema.shape.startDate,
  projectSteps: projectSchema.shape.projectSteps,
});

// Type inféré à partir du schéma Zod
type FormData = z.infer<typeof formSchema>;

export default function MultiStepForm() {
  const steps: Step[] = [
    { id: "job", label: "Le job" },
    { id: "profile", label: "Le profil idéal" },
    { id: "steps", label: "Les étapes clés" },
    { id: "summary", label: "Récapitulatif" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    jobDescription: "",
    skills: [{ value: "", label: "" }],
    tjm: "",
    dateOfStart: "",
    dateOfEnd: "",
    typePresence: "",
    experience: "Intermédiaire",
    startDate: "",
    projectSteps: "",
  });
  const [selectedDateStart, setSelectedDateStart] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | undefined>(
    undefined,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(
    new Set(),
  );

  // Mettre à jour formData.dateOfStart lorsque selectedDate change
  useEffect(() => {
    if (selectedDateStart) {
      setFormData((prev) => ({
        ...prev,
        // dateOfStart: format(selectedDateStart, "dd-MM-yyyy"),
        dateOfStart: selectedDateStart.toISOString(),
      }));

      // Marquer le champ comme touché
      setTouchedFields((prev) => {
        const newTouched = new Set(prev);
        newTouched.add("dateOfStart");
        return newTouched;
      });
    }
  }, [selectedDateStart]);

  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  const validateJobStep = () => {
    const newErrors: FormErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Le titre du poste est requis";
    } else if (formData.jobTitle.length < 3) {
      newErrors.jobTitle = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "La description du poste est requise";
    } else if (formData.jobDescription.length < 20) {
      newErrors.jobDescription =
        "La description doit contenir au moins 20 caractères";
    }

    return newErrors;
  };

  const validateProfileStep = () => {
    const newErrors: FormErrors = {};

    if (!formData.skills.trim()) {
      newErrors.skills = "Les compétences requises sont nécessaires";
    }

    if (!formData.tjm.trim()) {
      newErrors.tjm = "Le tarif journalier est requis";
    } else if (isNaN(Number(formData.tjm))) {
      newErrors.tjm = "Le tarif doit être un nombre valide";
    }

    if (!formData.dateOfStart.trim()) {
      newErrors.dateOfStart = "La date de début est requise";
    } else if (new Date(formData.dateOfStart) < new Date()) {
      newErrors.dateOfStart = "La date de début ne peut pas être dans le passé";
    }

    if (formData.dateOfEnd && formData.dateOfEnd < formData.dateOfStart) {
      newErrors.dateOfEnd =
        "La date de fin ne peut pas être antérieure à la date de début";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Le niveau d'expérience est requis";
    }

    return newErrors;
  };

  const validateProjectStep = () => {
    const newErrors: FormErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!formData.projectSteps.trim()) {
      newErrors.projectSteps = "Les étapes du projet sont requises";
    }

    return newErrors;
  };

  // Validation avec Zod selon l'étape actuelle
  const validateCurrentStep = () => {
    try {
      switch (currentStep) {
        case 0:
          // Valider uniquement les champs de l'étape "job"
          jobSchema.parse({
            jobTitle: formData.jobTitle,
            jobDescription: formData.jobDescription,
          });
          return {};
        case 1:
          // Valider uniquement les champs de l'étape "profile"
          profileSchema.parse({
            skills: formData.skills,
            tjm: formData.tjm,
            dateOfStart: formData.dateOfStart,
            dateOfEnd: formData.dateOfEnd,
            typePresence: formData.typePresence,
            experience: formData.experience,
          });
          return {};
        case 2:
          // Valider uniquement les champs de l'étape "project"
          projectSchema.parse({
            startDate: formData.startDate,
            projectSteps: formData.projectSteps,
          });
          return {};
        default:
          return {};
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convertir les erreurs Zod en un objet d'erreurs simple
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Mark field as touched
    setTouchedFields((prev) => {
      const newTouched = new Set(prev);
      newTouched.add(name as keyof FormData);
      return newTouched;
    });
  };

  // Handle field blur
  const handleBlur = (fieldName: keyof FormData) => {
    setTouchedFields((prev) => {
      const newTouched = new Set(prev);
      newTouched.add(fieldName);
      return newTouched;
    });
  };

  // Validate on touched fields change
  useEffect(() => {
    const currentErrors = validateCurrentStep();
    const filteredErrors: Record<string, string> = {};

    // Only show errors for touched fields
    Object.keys(currentErrors).forEach((key) => {
      if (touchedFields.has(key as keyof FormData)) {
        filteredErrors[key] = currentErrors[key];
      }
    });

    setErrors(filteredErrors);
  }, [formData, touchedFields, currentStep]);

  const goToNextStep = () => {
    const currentErrors = validateCurrentStep();

    // Touch all fields in current step to show all errors
    const fieldsToTouch = new Set(touchedFields);
    if (currentStep === 0) {
      fieldsToTouch.add("jobTitle");
      fieldsToTouch.add("jobDescription");
    } else if (currentStep === 1) {
      fieldsToTouch.add("skills");
      fieldsToTouch.add("tjm");
      fieldsToTouch.add("dateOfStart");
      fieldsToTouch.add("dateOfEnd");
      fieldsToTouch.add("typePresence");
      fieldsToTouch.add("experience");
    } else if (currentStep === 2) {
      fieldsToTouch.add("startDate");
      fieldsToTouch.add("projectSteps");
    }

    setTouchedFields(fieldsToTouch);

    // Check if there are any errors
    if (Object.keys(currentErrors).length === 0) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Update errors to show all errors in the current step
      setErrors(currentErrors);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = () => {
    // Valider le formulaire complet avec Zod
    try {
      const validatedData = formSchema.parse(formData);
      console.log("Données validées:", validatedData);
      alert("Formulaire soumis avec succès!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Erreurs de validation:", error.errors);
        alert("Le formulaire contient des erreurs. Veuillez les corriger.");
      }
    }
  };

  // Formater la date pour l'affichage
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", {
        locale: require("date-fns/locale/fr"),
      });
    } catch (error) {
      return dateString;
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
            onClick={() => {
              // Only allow navigation to previous steps or current step
              if (index <= currentStep) {
                setCurrentStep(index);
              }
            }}
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
                  Titre du poste
                </h2>
                <p className="text-gray-400">
                  Veuillez entrer le titre du poste.
                </p>
              </div>
              <Input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                onBlur={() => handleBlur("jobTitle")}
                className={`text-freehunt-main rounded-full ${
                  errors.jobTitle ? "border-red-500" : ""
                }`}
                placeholder="Exemple : Développeur Front-End React"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.jobTitle}
                </p>
              )}
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
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                onBlur={() => handleBlur("jobDescription")}
                className={`w-full p-2 border rounded-xl h-32 ${
                  errors.jobDescription ? "border-red-500" : ""
                }`}
                placeholder="Exemple : Nous recherchons un développeur Front-End React pour accompagner la refonte de notre site e-commerce. Le freelance devra collaborer avec notre UX designer et intégrer les maquettes Figma."
              ></Textarea>
              {errors.jobDescription && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.jobDescription}
                </p>
              )}
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
              <MultiSelect
                // name="skills"
                options={SKILLS}
                selected={formData.skills}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    skills: value as [Skill, ...Skill[]],
                  })
                }
                // onBlur={() => handleBlur("skills")}
                className={`${errors.skills ? "border-red-500" : ""}`}
                placeholder="Sélectionnez les compétences"
              />
              {errors.skills && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.skills}
                </p>
              )}
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
                type="number"
                name="tjm"
                value={formData.tjm}
                onChange={handleChange}
                onBlur={() => handleBlur("tjm")}
                className={`text-freehunt-main rounded-full ${
                  errors.tjm ? "border-red-500" : ""
                }`}
                placeholder="Exemple : 500 €/jour"
              />
              {errors.tjm && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.tjm}
                </p>
              )}
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
                <DatePicker
                  date={selectedDateStart}
                  setDate={setSelectedDateStart}
                  className={`text-freehunt-black-two rounded-full ${
                    errors.dateOfStart ? "border-red-500" : ""
                  }`}
                />
                {errors.dateOfStart && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.dateOfStart}
                  </p>
                )}
              </div>

              {/* Input Date de Fin */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-freehunt-main">
                    Date de fin (optionnelle)
                  </h2>
                  <p className="text-gray-400">
                    Sélectionnez une date de fin de mission.
                  </p>
                </div>
                <DatePicker
                  date={selectedDateEnd}
                  setDate={setSelectedDateEnd}
                  className={`text-freehunt-black-two rounded-full ${
                    errors.dateOfEnd ? "border-red-500" : ""
                  }`}
                />
                {errors.dateOfEnd && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.dateOfEnd}
                  </p>
                )}
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
              <RadioGroup
                value={formData.typePresence}
                onValueChange={(value) =>
                  setFormData({ ...formData, typePresence: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={JobPostingLocation.ONSITE}
                    id={JobPostingLocation.ONSITE}
                    className={errors.typePresence ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor={JobPostingLocation.ONSITE}
                    className="text-freehunt-black-two"
                  >
                    Sur site
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={JobPostingLocation.REMOTE}
                    id={JobPostingLocation.REMOTE}
                    className={errors.typePresence ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor={JobPostingLocation.REMOTE}
                    className="text-freehunt-black-two"
                  >
                    Télétravail
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={JobPostingLocation.HYBRID}
                    id={JobPostingLocation.HYBRID}
                    className={errors.typePresence ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor={JobPostingLocation.HYBRID}
                    className="text-freehunt-black-two"
                  >
                    Hybride
                  </Label>
                </div>
              </RadioGroup>
              {errors.typePresence && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.typePresence}
                </p>
              )}
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
