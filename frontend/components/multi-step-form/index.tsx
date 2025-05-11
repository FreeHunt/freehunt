"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../common/multi-select";
import { DatePicker } from "../common/date-picker";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { JobPostingLocation } from "@/lib/interfaces";

type Step = {
  id: string;
  label: string;
};

type Checkpoint = {
  id: string;
  name: string;
  description: string;
  deadline: string;
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
        console.log("dateStart", date);
        return (
          new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
      },
      {
        message: "La date de début ne peut pas être dans le passé",
      },
    ),
  dateOfEnd: z.string().optional(),
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

const checkpointSchema = z.object({
  name: z.string().min(1, "Le nom de l'étape est requis"),
  description: z.string().min(1, "La description de l'étape est requise"),
  deadline: z
    .string()
    .min(1, "La date limite est requise")
    .refine(
      (date) => {
        return (
          new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
      },
      {
        message: "La date limite ne peut pas être dans le passé",
      },
    ),
});

const projectSchema = z.object({
  checkpoints: z
    .array(checkpointSchema)
    .min(1, "Au moins un checkpoint du projet est requis"),
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
  checkpoints: z.array(checkpointSchema),
});

// Type inféré à partir du schéma Zod
type FormData = Omit<z.infer<typeof formSchema>, "checkpoints" | "skills"> & {
  checkpoints: Checkpoint[];
  skills: Skill[];
};

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
    skills: [],
    tjm: "",
    dateOfStart: "",
    dateOfEnd: "",
    typePresence: "",
    experience: "Intermédiaire",
    checkpoints: [],
  });
  const [selectedDateStart, setSelectedDateStart] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | undefined>(
    undefined,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // État pour gérer les dates des deadlines des checkpoints
  const [checkpointDeadlines, setCheckpointDeadlines] = useState<
    Record<string, Date | undefined>
  >({});

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

  // Mettre à jour formData.dateOfEnd lorsque selectedDateEnd change
  useEffect(() => {
    if (selectedDateEnd) {
      setFormData((prev) => ({
        ...prev,
        dateOfEnd: selectedDateEnd.toISOString(),
      }));

      // Marquer le champ comme touché
      setTouchedFields((prev) => {
        const newTouched = new Set(prev);
        newTouched.add("dateOfEnd");
        return newTouched;
      });
    }
  }, [selectedDateEnd]);

  // Mettre à jour formData.dateOfEnd lorsque selectedDate (et qu'elle est postérieure à la date de fin) change
  useEffect(() => {
    if (selectedDateStart && selectedDateEnd) {
      if (selectedDateStart > selectedDateEnd) {
        // Réinitialiser la date de fin ou l'aligner sur la date de début
        setSelectedDateEnd(selectedDateStart);

        setFormData((prev) => ({
          ...prev,
          dateOfEnd: selectedDateStart.toISOString(),
        }));

        // Marquer le champ comme touché
        setTouchedFields((prev) => {
          const newTouched = new Set(prev);
          newTouched.add("dateOfEnd");
          return newTouched;
        });
      }
    }
  }, [selectedDateStart]);

  // Remplacer votre fonction handleEndDateChange
  const handleEndDateChange = (date: Date | undefined) => {
    // Toujours mettre à jour la date de fin sélectionnée
    setSelectedDateEnd(date);

    // Vérifier si la date est antérieure à la date de début
    if (date && selectedDateStart && date < selectedDateStart) {
      // Afficher un message d'erreur mais ne pas corriger la date
      setErrors((prev) => ({
        ...prev,
        dateOfEnd:
          "La date de fin ne peut pas être antérieure à la date de début",
      }));
    } else {
      // Si la date est valide, supprimer l'erreur
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateOfEnd;
        return newErrors;
      });
    }
  };

  // Mettre à jour les deadlines des checkpoints
  useEffect(() => {
    const updatedCheckpoints = formData.checkpoints.map((checkpoint) => {
      if (checkpointDeadlines[checkpoint.id]) {
        return {
          ...checkpoint,
          deadline: (checkpointDeadlines[checkpoint.id] as Date).toISOString(),
        };
      }
      return checkpoint;
    });

    if (
      JSON.stringify(updatedCheckpoints) !==
      JSON.stringify(formData.checkpoints)
    ) {
      setFormData((prev) => ({
        ...prev,
        checkpoints: updatedCheckpoints,
      }));
    }
  }, [checkpointDeadlines]);

  const addCheckpoint = () => {
    const newCheckpointId = `checkpoint-${Date.now()}`;
    const newCheckpoint: Checkpoint = {
      id: newCheckpointId,
      name: "",
      description: "",
      deadline: "",
    };

    setFormData((prev) => ({
      ...prev,
      checkpoints: [...prev.checkpoints, newCheckpoint],
    }));
  };

  const removeCheckpoint = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.filter(
        (checkpoint) => checkpoint.id !== id,
      ),
    }));

    // Supprimer également la deadline associée
    const newDeadlines = { ...checkpointDeadlines };
    delete newDeadlines[id];
    setCheckpointDeadlines(newDeadlines);
  };

  const updateCheckpoint = (
    id: string,
    field: keyof Omit<Checkpoint, "id">,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.map((checkpoint) =>
        checkpoint.id === id ? { ...checkpoint, [field]: value } : checkpoint,
      ),
    }));

    // Marquer le champ comme touché
    setTouchedFields((prev) => {
      const newTouched = new Set(prev);
      newTouched.add(`checkpoints.${id}.${field}`);
      return newTouched;
    });
  };

  // Fonction pour définir la deadline d'un checkpoint
  const setCheckpointDeadline = (id: string, date: Date | undefined) => {
    setCheckpointDeadlines((prev) => ({
      ...prev,
      [id]: date,
    }));

    if (date) {
      // Marquer le champ comme touché
      setTouchedFields((prev) => {
        const newTouched = new Set(prev);
        newTouched.add(`checkpoints.${id}.deadline`);
        return newTouched;
      });
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

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
          // Vérifier si au moins un checkpoint est défini
          // if (formData.checkpoints.length === 0) {
          //   return {
          //     checkpoints: "Au moins un checkpoint du projet est requis",
          //   };
          // }

          // Valider chaque checkpoint du projet
          const checkpointErrors: Record<string, string> = {};
          formData.checkpoints.forEach((checkpoint) => {
            try {
              checkpointSchema.parse(checkpoint);
            } catch (error) {
              if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                  if (err.path.length > 0) {
                    const field = err.path[0] as string;
                    checkpointErrors[`checkpoints.${checkpoint.id}.${field}`] =
                      err.message;
                  }
                });
              }
            }
          });
          return checkpointErrors;
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
  const handleBlur = (fieldName: string) => {
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

    // Préserver les erreurs personnalisées qui ne viennent pas de Zod
    setErrors((prevErrors) => {
      // Liste des erreurs personnalisées à conserver
      const customErrorKeys = ["dateOfEnd"]; // Ajoutez d'autres clés ici si nécessaire

      const newErrors = { ...filteredErrors };

      // Conserver toutes les erreurs personnalisées
      customErrorKeys.forEach((key) => {
        if (prevErrors[key]) {
          newErrors[key] = prevErrors[key];
        }
      });

      return newErrors;
    });
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
      // Marquer tous les champs des checkpoints comme touchés
      formData.checkpoints.forEach((checkpoint) => {
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.name`);
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.description`);
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.deadline`);
      });

      // Si aucun checkpoint n'est défini, marquer le champ checkpoints comme touché
      if (formData.checkpoints.length === 0) {
        fieldsToTouch.add("checkpoints");
      }
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

  // Vérifier si un checkpoint a des erreurs
  const hasCheckpointErrors = (checkpointId: string) => {
    return Object.keys(errors).some((key) =>
      key.startsWith(`checkpoints.${checkpointId}`),
    );
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
                className={`rounded-full ${
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
                  setDate={handleEndDateChange}
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
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center mb-2">
              {/* <label className="block text-sm font-medium">
                Checkpoints du projet <span className="text-red-500">*</span>
              </label> */}
              <Button
                onClick={addCheckpoint}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 cursor-pointer border-full"
              >
                <Plus className="h-4 w-4 text-freehunt-main" />
                Ajouter une étape
              </Button>
            </div>

            {formData.checkpoints.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md bg-gray-50">
                <p className="text-gray-500">
                  Aucun checkpoint défini. Cliquez sur &quot;Ajouter une
                  étape&quot; pour commencer.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Liste des checkpoints */}
                {formData.checkpoints.map((checkpoint, index) => (
                  <div
                    key={checkpoint.id}
                    className={`border rounded-md p-4 flex flex-col gap-3 ${
                      hasCheckpointErrors(checkpoint.id)
                        ? "border-red-200 bg-red-50"
                        : ""
                    }`}
                  >
                    {/* Checkpoint Header + Delete */}
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-freehunt-grey-dark underline">
                        Checkpoint {index + 1} :
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCheckpoint(checkpoint.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-2 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Input Nom du Checkpoint */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-freehunt-main">
                          Nom de l&apos;étape
                        </h2>
                        <p className="text-gray-400">
                          Veuillez saissir le nom de l&apos;étape.
                        </p>
                      </div>
                      <Input
                        type="text"
                        value={checkpoint.name}
                        onChange={(e) =>
                          updateCheckpoint(
                            checkpoint.id,
                            "name",
                            e.target.value,
                          )
                        }
                        onBlur={() =>
                          handleBlur(`checkpoints.${checkpoint.id}.name`)
                        }
                        className={`w-full p-2 border rounded-md ${
                          errors[`checkpoints.${checkpoint.id}.name`]
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Exemple : Étape 1 - Analyse des besoins"
                      />
                      {errors[`checkpoints.${checkpoint.id}.name`] && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[`checkpoints.${checkpoint.id}.name`]}
                        </p>
                      )}
                    </div>

                    {/* Input Description Checkpoint */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-freehunt-main">
                          Description
                        </h2>
                        <p className="text-gray-400">
                          Détaillez davantage ici ce que vous voulez réaliser
                          lors de cette étape.
                        </p>
                      </div>
                      <Textarea
                        name="checkpointDescription"
                        value={checkpoint.description}
                        onChange={(e) =>
                          updateCheckpoint(
                            checkpoint.id,
                            "description",
                            e.target.value,
                          )
                        }
                        onBlur={() =>
                          handleBlur(`checkpoints.${checkpoint.id}.description`)
                        }
                        className={`w-full p-2 border rounded-md ${
                          errors[`checkpoints.${checkpoint.id}.description`]
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Exemple : Nous souhaitons réaliser une analyse approfondie des besoins du client afin de définir les fonctionnalités clés de la plateforme. Cela inclut des entretiens avec les parties prenantes et l'examen de la documentation existante."
                      ></Textarea>
                      {errors[`checkpoints.${checkpoint.id}.description`] && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[`checkpoints.${checkpoint.id}.description`]}
                        </p>
                      )}
                    </div>

                    {/* Input Deadline Checkpoint */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-freehunt-main">
                          Deadline
                        </h2>
                        <p className="text-gray-400">
                          Sélectionnez une date limite pour cette étape.
                        </p>
                      </div>
                      <DatePicker
                        date={checkpointDeadlines[checkpoint.id]}
                        setDate={(date) =>
                          setCheckpointDeadline(checkpoint.id, date)
                        }
                        className={
                          errors[`checkpoints.${checkpoint.id}.deadline`]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors[`checkpoints.${checkpoint.id}.deadline`] && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[`checkpoints.${checkpoint.id}.deadline`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step Four */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-freehunt-main">
              Récapitulatif de la mission
            </h2>
            <p className="text-gray-600 mb-2">
              Veuillez vérifier toutes les informations avant de soumettre votre
              offre de mission.
            </p>

            {/* Informations du job */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-freehunt-main mb-4">
                Informations du poste
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Titre du poste</p>
                  <p className="font-medium">
                    {formData.jobTitle || "Non spécifié"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Description</p>
                  <p className="whitespace-pre-wrap">
                    {formData.jobDescription || "Non spécifié"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profil recherché */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-freehunt-main mb-4">
                Profil recherché
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Compétences requises</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.skills && formData.skills.length > 0 ? (
                      formData.skills.map((skill) => (
                        <span
                          key={skill.value}
                          className="bg-freehunt-main/10 text-freehunt-main px-2 py-1 rounded-full text-sm"
                        >
                          {skill.label}
                        </span>
                      ))
                    ) : (
                      <p>Aucune compétence spécifiée</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Tarif journalier</p>
                  <p className="font-medium">
                    {formData.tjm ? `${formData.tjm} €/jour` : "Non spécifié"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">
                    Niveau d&apos;expérience
                  </p>
                  <p className="font-medium">
                    {formData.experience || "Non spécifié"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Type de présence</p>
                  <p className="font-medium">
                    {formData.typePresence === JobPostingLocation.ONSITE &&
                      "Sur site"}
                    {formData.typePresence === JobPostingLocation.REMOTE &&
                      "Télétravail"}
                    {formData.typePresence === JobPostingLocation.HYBRID &&
                      "Hybride"}
                    {!formData.typePresence && "Non spécifié"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Date de début</p>
                  <p className="font-medium">
                    {formData.dateOfStart
                      ? new Date(formData.dateOfStart).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Non spécifiée"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">
                    Date de fin (optionnelle)
                  </p>
                  <p className="font-medium">
                    {formData.dateOfEnd
                      ? new Date(formData.dateOfEnd).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Non spécifiée"}
                  </p>
                </div>
              </div>
            </div>

            {/* Étapes clés */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-freehunt-main mb-4">
                Étapes clés du projet
              </h3>
              {formData.checkpoints && formData.checkpoints.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {formData.checkpoints.map((checkpoint, index) => (
                    <div
                      key={checkpoint.id}
                      className="border-l-4 border-freehunt-main pl-4 py-2"
                    >
                      <p className="font-medium text-lg">
                        {checkpoint.name || `Étape ${index + 1}`}
                      </p>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                        {checkpoint.description || "Aucune description"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Deadline:{" "}
                        {checkpoint.deadline
                          ? new Date(checkpoint.deadline).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "Non spécifiée"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucune étape clé définie</p>
              )}
            </div>

            <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="font-medium text-yellow-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Veuillez vérifier toutes les informations avant de soumettre.
                Une fois soumise, votre offre de mission sera visible par les
                freelances.
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
