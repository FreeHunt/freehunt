"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../common/multi-select";
import { DatePicker } from "../common/date-picker";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import {
  Checkpoint,
  CheckpointStatus,
  JobPostingLocation,
  Skill,
} from "@/lib/interfaces";
import { submitJobPosting } from "@/actions/jobPostings";
import { getCurrentUser } from "@/actions/auth";
import { getCurrentCompany } from "@/actions/company";
import { getSkills } from "@/actions/skills";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Step = {
  id: string;
  label: string;
};

const validPresenceForZod = Object.values(JobPostingLocation) as [
  string,
  ...string[],
];

// Définition des schémas Zod pour chaque étape
const jobSchema = z.object({
  jobTitle: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  jobDescription: z
    .string()
    .min(5, "La description doit contenir au moins 5 caractères"),
});

const profileSchema = z.object({
  skills: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        normalizedName: z.string(),
        aliases: z.array(z.string()),
        type: z.enum(["TECHNICAL", "SOFT"]),
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
  seniority: z
    .string()
    .min(0, "L'expérience doit être un nombre positif")
    .regex(/^\d+$/, "Le niveau d'expérience doit être un nombre valide"),
});

const checkpointSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom de l'étape est requis"),
  description: z.string().min(1, "La description de l'étape est requise"),
  date: z
    .string()
    .min(1, "La date fin est requise")
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
  status: z.enum([
    CheckpointStatus.TODO,
    CheckpointStatus.IN_PROGRESS,
    CheckpointStatus.DONE,
    CheckpointStatus.DELAYED,
    CheckpointStatus.CANCELED,
  ]),
  amount: z.string().regex(/^\d+$/, "Le montant doit être un nombre valide"),
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
  seniority: profileSchema.shape.seniority,
  checkpoints: z.array(checkpointSchema),
});

// Type inféré à partir du schéma Zod
export type FormData = Omit<
  z.infer<typeof formSchema>,
  "checkpoints" | "skills"
> & {
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

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    jobDescription: "",
    skills: [],
    tjm: "",
    dateOfStart: "",
    dateOfEnd: "",
    typePresence: "",
    seniority: "",
    checkpoints: [],
  });
  const [selectedDateStart, setSelectedDateStart] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | undefined>(
    undefined,
  );
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // États pour la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // État pour gérer les dates des deadlines des checkpoints
  const [checkpointDatesOfEnd, setCheckpointDatesOfEnd] = useState<
    Record<string, Date | undefined>
  >({});

  // Charger les compétences disponibles
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsResponse = await getSkills();
        setSkills(skillsResponse);
      } catch (error) {
        console.error("Erreur lors du chargement des compétences :", error);
      }
    };

    fetchSkills();
  }, []);

  // Mettre à jour formData.skills lorsque selectedSkills change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills,
    }));

    // Marquer le champ comme touché
    // setTouchedFields((prev) => {
    //   const newTouched = new Set(prev);
    //   newTouched.add("skills");
    //   return newTouched;
    // });
  }, [selectedSkills]);

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

  // Fonction centralisée pour valider les dates
  const validateDates = (
    startDate?: string | Date,
    endDate?: string | Date,
  ) => {
    // Si la date de fin n'est pas définie, pas d'erreur
    if (!endDate) return null;
    if (!startDate) return null;

    // Convertir les dates en objets Date si ce sont des chaînes
    const start =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;

    // Vérifier que la date de fin n'est pas antérieure à la date de début
    if (end < start) {
      return "La date de fin ne peut pas être antérieure à la date de début";
    }

    return null; // Pas d'erreur
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setSelectedDateEnd(date);

    const dateError = validateDates(selectedDateStart, date);

    if (dateError) {
      setErrors((prev) => ({
        ...prev,
        dateOfEnd: dateError,
      }));
    } else {
      // Supprimer l'erreur
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateOfEnd;
        return newErrors;
      });
    }
  };

  // Mettre à jour les dates des checkpoints
  useEffect(() => {
    const updatedCheckpoints = formData.checkpoints.map((checkpoint) => {
      if (checkpointDatesOfEnd[checkpoint.id]) {
        return {
          ...checkpoint,
          date: (checkpointDatesOfEnd[checkpoint.id] as Date).toISOString(),
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
  }, [checkpointDatesOfEnd]);

  const addCheckpoint = () => {
    const newCheckpointId = `checkpoint-${Date.now()}`;
    const newCheckpoint: Checkpoint = {
      id: newCheckpointId,
      name: "",
      description: "",
      date: "",
      status: "TODO",
      jobPostingId: "",
      amount: 0,
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

    // Supprimer également la date associée
    const newDeadlines = { ...checkpointDatesOfEnd };
    delete newDeadlines[id];
    setCheckpointDatesOfEnd(newDeadlines);
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
  const handleSetCheckpointDateOfEnd = (id: string, date: Date | undefined) => {
    setCheckpointDatesOfEnd((prev) => ({
      ...prev,
      [id]: date,
    }));

    if (date) {
      // Marquer le champ comme touché
      setTouchedFields((prev) => {
        const newTouched = new Set(prev);
        newTouched.add(`checkpoints.${id}.date`);
        return newTouched;
      });
    }
  };

  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

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
            seniority: formData.seniority,
          });

          // Validation des dates
          const errors: Record<string, string> = {};
          const dateError = validateDates(
            formData.dateOfStart,
            formData.dateOfEnd,
          );

          if (dateError) {
            errors.dateOfEnd = dateError;
          }

          return errors;
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

        // Validation des dates
        const dateError = validateDates(
          formData.dateOfStart,
          formData.dateOfEnd,
        );
        if (dateError) {
          fieldErrors.dateOfEnd = dateError;
        }

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
      fieldsToTouch.add("seniority");
    } else if (currentStep === 2) {
      // Marquer tous les champs des checkpoints comme touchés
      formData.checkpoints.forEach((checkpoint) => {
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.name`);
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.description`);
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.date`);
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.status`);
        fieldsToTouch.add(`checkpoints.${checkpoint.id}.amount`);
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

  const handleSubmitForm = async () => {
    // Valider le formulaire complet avec Zod
    try {
      const auth = await getCurrentUser();
      const currentCompany = await getCurrentCompany(auth.id);

      const validatedData = formSchema.parse(formData);
      console.log("Données validées:", validatedData); //TODO remove
      setSubmitResult(null);
      setIsSubmitting(true);
      const result = await submitJobPosting(
        {
          title: validatedData.jobTitle,
          description: validatedData.jobDescription,
          location: validatedData.typePresence,
          isPromoted: false,
          averageDailyRate: +validatedData.tjm,
          seniority: +validatedData.seniority,
          companyId: currentCompany.id,
          skillIds: validatedData.skills.map((skill) => skill.id),
          // dateOfStart: validatedData.dateOfStart,
          // dateOfEnd: validatedData.dateOfEnd,
        },
        validatedData.checkpoints.map((checkpoint) => ({
          id: checkpoint.id,
          name: checkpoint.name,
          description: checkpoint.description,
          date: checkpoint.date,
          status: checkpoint.status,
          jobPostingId: "", // Est rempli par l'API suite à la création du job
          amount: +checkpoint.amount,
        })),
      );

      setSubmitResult({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert("Le formulaire contient des erreurs. Veuillez les corriger.");
      }
    } finally {
      setIsSubmitting(false);
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
              // allow navigation to previous steps or current step or next step if data is valid
              if (index <= currentStep) {
                setCurrentStep(index);
              } else if (index === currentStep + 1) {
                const currentErrors = validateCurrentStep();
                if (Object.keys(currentErrors).length === 0) {
                  setCurrentStep(index);
                } else {
                  // Update errors to show all errors in the current step
                  setErrors(currentErrors);
                }
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
                options={skills}
                addOptions={setSkills}
                selected={selectedSkills}
                onChange={setSelectedSkills}
                className={`rounded-full ${
                  errors.skills ? "border-red-500" : ""
                }`}
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
                className={`text-freehunt-black-two rounded-full ${
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

            <div className="flex gap-24 flex-wrap">
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

            {/* Input Expérience */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-freehunt-main">
                  Niveau d&apos;expérience (en années)
                </h2>
                <p className="text-gray-400">
                  Quel niveau d&apos;expérience est requis pour cette mission ?
                </p>
              </div>
              <Input
                type="number"
                name="seniority"
                value={formData.seniority}
                onChange={handleChange}
                onBlur={() => handleBlur("seniority")}
                className={`text-freehunt-black-two rounded-full ${
                  errors.seniority ? "border-red-500" : ""
                }`}
                placeholder="Exemple : 3 (pour 3 ans d'expérience)"
              />
              {errors.seniority && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.seniority}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step Three */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-8">
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
                      <h2 className="text-xl font-bold text-freehunt-black-two">
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

                    {/* Input Date de Fin Checkpoint */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-freehunt-main">
                          Date de fin
                        </h2>
                        <p className="text-gray-400">
                          Sélectionnez une date limite pour cette étape.
                        </p>
                      </div>
                      <DatePicker
                        date={checkpointDatesOfEnd[checkpoint.id]}
                        setDate={(date) =>
                          handleSetCheckpointDateOfEnd(checkpoint.id, date)
                        }
                        className={
                          errors[`checkpoints.${checkpoint.id}.date`]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors[`checkpoints.${checkpoint.id}.date`] && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[`checkpoints.${checkpoint.id}.date`]}
                        </p>
                      )}
                    </div>

                    {/* Input Status Checkpoint */}
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-bold text-freehunt-main">
                        Statut
                      </h2>
                      <p className="text-gray-400">
                        Statut actuel de cette étape.
                      </p>
                      <Select
                        value={checkpoint.status}
                        onValueChange={(value) =>
                          updateCheckpoint(checkpoint.id, "status", value)
                        }
                        // className={`w-full ${
                        //   errors[`checkpoints.${checkpoint.id}.status`]
                        //     ? "border-red-500"
                        //     : ""
                        // }`}
                      >
                        <SelectTrigger className="rounded-full">
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(CheckpointStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`checkpoints.${checkpoint.id}.status`] && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[`checkpoints.${checkpoint.id}.status`]}
                        </p>
                      )}
                    </div>

                    {/* Input Amount Checkpoint */}
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-bold text-freehunt-main">
                        Montant
                      </h2>
                      <p className="text-gray-400">
                        Montant versé lors de la réalisation de cette étape.
                      </p>
                      <Input
                        type="number"
                        value={checkpoint.amount}
                        onChange={(e) =>
                          updateCheckpoint(
                            checkpoint.id,
                            "amount",
                            e.target.value,
                          )
                        }
                        onBlur={() =>
                          handleBlur(`checkpoints.${checkpoint.id}.amount`)
                        }
                        className={`w-full p-2 border rounded-md ${
                          errors[`checkpoints.${checkpoint.id}.amount`]
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Exemple : 1000 €"
                      />
                      {errors[`checkpoints.${checkpoint.id}.amount`] && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors[`checkpoints.${checkpoint.id}.amount`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bouton pour ajouter un checkpoint */}
            <div className="flex justify-between items-center mb-2">
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
                          key={skill.id}
                          className="bg-freehunt-main/10 text-freehunt-main px-2 py-1 rounded-full text-sm"
                        >
                          {skill.name}
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
                    {formData.seniority || "Non spécifié"}
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
                        Date de fin:{" "}
                        {checkpoint.date
                          ? new Date(checkpoint.date).toLocaleDateString(
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

            {/* Message de résultat de soumission */}
            {submitResult && (
              <div
                className={`p-4 mb-4 rounded-md ${
                  submitResult.success
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center">
                  {submitResult.success ? (
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <p>{submitResult.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 0 || isSubmitting}
        >
          Précédent
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={goToNextStep}>Suivant</Button>
        ) : (
          <Button
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Soumettre"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
