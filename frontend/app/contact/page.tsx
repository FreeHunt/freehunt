"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Clock, Mail } from "lucide-react";
import { useState } from "react";

interface FormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

interface FormErrors {
  nom?: string;
  email?: string;
  sujet?: string;
  message?: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-freehunt-grey rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="font-semibold text-lg">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-freehunt-grey-dark" />
        ) : (
          <ChevronDown className="h-5 w-5 text-freehunt-grey-dark" />
        )}
      </button>
      {isOpen && (
        <p className="mt-3 text-freehunt-grey-dark leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.sujet.trim()) {
      newErrors.sujet = "Le sujet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const subject = encodeURIComponent(`[Contact FreeHunt] ${formData.sujet}`);
    const body = encodeURIComponent(
      `Nom: ${formData.nom}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    );

    window.location.href = `mailto:contact@freehunt.fr?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ nom: "", email: "", sujet: "", message: "" });
      setErrors({});
    }, 1000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const faqData = [
    {
      question: "Comment créer un compte freelance ?",
      answer:
        "Cliquez sur 'S'inscrire' dans le menu principal, sélectionnez 'Freelance' et suivez les étapes pour créer votre profil professionnel.",
    },
    {
      question: "Comment publier une offre d'emploi ?",
      answer:
        "Après avoir créé votre compte entreprise, accédez à votre tableau de bord et cliquez sur 'Publier une offre'. Remplissez les détails de votre projet pour attirer les meilleurs freelances.",
    },
    {
      question: "Comment contacter un freelance ?",
      answer:
        "Parcourez les profils, consultez leurs compétences et portfolios, puis utilisez notre système de messagerie intégré pour discuter directement de votre projet.",
    },
    {
      question: "Quels sont les frais de la plateforme ?",
      answer:
        "L'inscription et la navigation sont gratuites. Nous appliquons une commission uniquement lors de la finalisation d'un contrat entre freelance et entreprise.",
    },
  ];

  return (
    <>
      <section className="flex items-center justify-center p-10 lg:p-20 bg-freehunt-beige-dark">
        <div className="flex flex-col items-center max-w-4xl gap-7 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold">Contactez-nous</h1>
          <h2 className="text-xl lg:text-2xl font-bold text-freehunt-grey-dark">
            Une question ? N&apos;hésitez pas à nous écrire
          </h2>
        </div>
      </section>

      <section className="p-10 lg:p-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium mb-2">
                  Nom *
                </label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  className={`${errors.nom ? "border-red-500" : ""}`}
                  placeholder="Votre nom complet"
                />
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`${errors.email ? "border-red-500" : ""}`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="sujet"
                  className="block text-sm font-medium mb-2"
                >
                  Sujet *
                </label>
                <Input
                  id="sujet"
                  type="text"
                  value={formData.sujet}
                  onChange={(e) => handleInputChange("sujet", e.target.value)}
                  className={`${errors.sujet ? "border-red-500" : ""}`}
                  placeholder="Objet de votre message"
                />
                {errors.sujet && (
                  <p className="text-red-500 text-sm mt-1">{errors.sujet}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-32 ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  placeholder="Décrivez votre demande..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-freehunt-main hover:bg-freehunt-main/90 text-white rounded-lg py-3"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">
                Informations de contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-freehunt-main" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-freehunt-grey-dark">
                      contact@freehunt.fr
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-freehunt-main" />
                  <div>
                    <p className="font-medium">Temps de réponse</p>
                    <p className="text-freehunt-grey-dark">
                      Nous répondons sous 24 heures ouvrées
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Questions fréquentes</h3>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
