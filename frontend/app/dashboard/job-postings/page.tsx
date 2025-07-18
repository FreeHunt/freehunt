"use client";

import { getCurrentUser } from "@/actions/auth";
import {
  canJobPostingBeCancelled,
  deleteJobPosting,
  getJobPostingsByUserId,
  processJobPostingPayment,
  publishJobPosting,
} from "@/actions/jobPostings";
import { CancelJobPostingButton } from "@/components/job-posting/CancelJobPostingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobPosting, JobPostingStatus, User } from "@/lib/interfaces";
import { showToast } from "@/lib/toast";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const getStatusBadge = (status: JobPostingStatus) => {
  switch (status) {
    case JobPostingStatus.PENDING_PAYMENT:
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle size={14} />
          En attente de paiement
        </Badge>
      );
    case JobPostingStatus.PAID:
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <Clock size={14} />
          Payée - En attente de publication
        </Badge>
      );
    case JobPostingStatus.PUBLISHED:
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle size={14} />
          Publiée
        </Badge>
      );
    case JobPostingStatus.CANCELED:
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X size={14} />
          Annulée
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusAction = (
  jobPosting: JobPosting,
  onAction: (action: string, id: string) => void,
  canBeCancelled: boolean = false,
  onCancelSuccess?: () => void,
) => {
  switch (jobPosting.status) {
    case JobPostingStatus.PENDING_PAYMENT:
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onAction("pay", jobPosting.id)}
            className="flex items-center gap-2"
          >
            <CreditCard size={16} />
            Payer (
            {jobPosting.totalAmount ? `${jobPosting.totalAmount}€` : "N/A"})
          </Button>
          {canBeCancelled && (
            <CancelJobPostingButton
              jobPostingId={jobPosting.id}
              jobPostingTitle={jobPosting.title}
              isPaid={false}
              hasProject={false}
              onCancelSuccess={onCancelSuccess}
            />
          )}
        </div>
      );
    case JobPostingStatus.PAID:
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onAction("publish", jobPosting.id)}
            className="flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Publier l&apos;annonce
          </Button>
          {canBeCancelled && (
            <CancelJobPostingButton
              jobPostingId={jobPosting.id}
              jobPostingTitle={jobPosting.title}
              isPaid={true}
              hasProject={false}
              onCancelSuccess={onCancelSuccess}
            />
          )}
        </div>
      );
    case JobPostingStatus.PUBLISHED:
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction("view", jobPosting.id)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Voir l&apos;annonce
          </Button>
          {canBeCancelled && (
            <CancelJobPostingButton
              jobPostingId={jobPosting.id}
              jobPostingTitle={jobPosting.title}
              isPaid={["PAID", "PUBLISHED"].includes(
                jobPosting.status as string,
              )}
              hasProject={false}
              onCancelSuccess={() => {
                // Recharger les job postings après annulation
                onCancelSuccess?.();
              }}
            />
          )}
        </div>
      );
    default:
      return null;
  }
};

export default function CompanyJobPostingsDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellableJobPostings, setCancellableJobPostings] = useState<
    Set<string>
  >(new Set());
  const loadJobPostings = useCallback(async () => {
    if (!user) return;

    try {
      const userJobPostings = await getJobPostingsByUserId(user.id);
      setJobPostings(userJobPostings);

      // Vérifier quelles annonces peuvent être annulées
      const cancellableSet = new Set<string>();
      await Promise.all(
        userJobPostings.map(async (jobPosting) => {
          const canBeCancelled = await canJobPostingBeCancelled(jobPosting.id);
          if (canBeCancelled) {
            cancellableSet.add(jobPosting.id);
          }
        }),
      );
      setCancellableJobPostings(cancellableSet);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      showToast.error("Erreur lors du chargement des annonces");
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          showToast.error("Vous devez être connecté pour accéder à cette page");
          return;
        }

        if (currentUser.role !== "COMPANY") {
          showToast.error(
            "Accès refusé : cette page est réservée aux entreprises",
          );
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        showToast.error("Erreur lors du chargement des annonces");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Charger les job postings quand user change
  useEffect(() => {
    if (user) {
      loadJobPostings();
    }
  }, [user, loadJobPostings]);

  const handleAction = async (action: string, jobPostingId: string) => {
    try {
      switch (action) {
        case "pay":
          // Rediriger vers Stripe pour le paiement
          if (!user?.email) {
            showToast.error(
              "Email utilisateur non disponible pour le paiement",
            );
            return;
          }
          await processJobPostingPayment(jobPostingId, user.email);
          // Pas besoin de showToast ici car l'utilisateur est redirigé vers Stripe
          break;

        case "publish":
          await publishJobPosting(jobPostingId);
          showToast.success("Annonce publiée avec succès!");
          break;

        case "cancel":
          // Demander confirmation avant suppression
          if (
            window.confirm(
              "Êtes-vous sûr de vouloir annuler et supprimer cette annonce ?\n\nCette action est irréversible. L'annonce sera supprimée définitivement ainsi que toutes les candidatures associées.\n\nNote: Cette action n'est possible que si aucune candidature n'a été acceptée (aucun projet créé).",
            )
          ) {
            const result = await deleteJobPosting(jobPostingId);
            if (result.success) {
              showToast.success(result.message);
            } else {
              showToast.error(result.message);
            }
          } else {
            return; // Annulation par l'utilisateur, pas besoin de recharger
          }
          break;

        case "view":
          window.open(`/job-postings/${jobPostingId}`, "_blank");
          return; // Pas besoin de recharger les données

        default:
          return;
      }

      // Recharger les données après l'action
      await refreshData();
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
      showToast.error(`Erreur lors de l'action ${action}`);
    }
  };

  const refreshData = async () => {
    if (!user) return;

    try {
      const userJobPostings = await getJobPostingsByUserId(user.id);
      setJobPostings(userJobPostings);

      // Vérifier quelles annonces peuvent être annulées
      const cancellableSet = new Set<string>();
      await Promise.all(
        userJobPostings.map(async (jobPosting) => {
          const canBeCancelled = await canJobPostingBeCancelled(jobPosting.id);
          if (canBeCancelled) {
            cancellableSet.add(jobPosting.id);
          }
        }),
      );
      setCancellableJobPostings(cancellableSet);
    } catch (error) {
      console.error("Erreur lors du rechargement des données:", error);
      showToast.error("Erreur lors du rechargement des annonces");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-freehunt-main mx-auto mb-4"></div>
          <p>Chargement de vos annonces...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Accès non autorisé</p>
        </div>
      </div>
    );
  }

  const pendingPaymentJobs = jobPostings.filter(
    (jp) => jp.status === JobPostingStatus.PENDING_PAYMENT,
  );
  const paidJobs = jobPostings.filter(
    (jp) => jp.status === JobPostingStatus.PAID,
  );
  const publishedJobs = jobPostings.filter(
    (jp) => jp.status === JobPostingStatus.PUBLISHED,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              📋 Gestion de mes annonces
            </h1>
            <p className="text-foreground mb-2">
              <strong>Centre de gestion complet</strong> : Paiements,
              publications, modifications et annulations de vos annonces.
            </p>
            <p className="text-muted-foreground text-sm">
              💡{" "}
              <em>
                Pour consulter uniquement vos annonces publiées et visibles par
                les freelances, utilisez le bouton &quot;Mes annonces
                publiées&quot; depuis le dashboard principal.
              </em>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                État de vos annonces
              </h2>
              <p className="text-gray-600 text-sm">
                Toutes vos annonces (payées, non payées, publiées, etc.)
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/job-postings/new")}
              className="bg-freehunt-main hover:bg-freehunt-main/90"
            >
              Créer une nouvelle annonce
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {pendingPaymentJobs.length}
              </div>
              <p className="text-sm text-gray-600">En attente de paiement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {paidJobs.length}
              </div>
              <p className="text-sm text-gray-600">Payées - À publier</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {publishedJobs.length}
              </div>
              <p className="text-sm text-gray-600">Publiées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-freehunt-main">
                {jobPostings.length}
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des annonces */}
        {jobPostings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">
                Vous n&apos;avez pas encore créé d&apos;annonce.
              </p>
              <Button
                onClick={() => (window.location.href = "/job-postings/new")}
              >
                Créer votre première annonce
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobPostings.map((jobPosting) => (
              <Card key={jobPosting.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {jobPosting.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>TJM: {jobPosting.averageDailyRate}€</span>
                        {jobPosting.totalAmount && (
                          <span>Montant total: {jobPosting.totalAmount}€</span>
                        )}
                        <span>
                          Créée le:{" "}
                          {new Date(jobPosting.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(jobPosting.status)}
                      {getStatusAction(
                        jobPosting,
                        handleAction,
                        cancellableJobPostings.has(jobPosting.id),
                        loadJobPostings,
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 line-clamp-2 mb-4">
                    {jobPosting.description}
                  </p>
                  {jobPosting.status === JobPostingStatus.PENDING_PAYMENT && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={16} />
                        <span className="font-medium">Paiement requis</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">
                        Cette annonce ne sera pas visible par les freelances
                        tant que le paiement n&apos;est pas effectué. Montant à
                        payer:{" "}
                        <strong>
                          {jobPosting.totalAmount
                            ? `${jobPosting.totalAmount}€`
                            : "Non défini"}
                        </strong>
                      </p>
                    </div>
                  )}
                  {jobPosting.status === JobPostingStatus.PAID && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <Clock size={16} />
                        <span className="font-medium">
                          Prête à être publiée
                        </span>
                      </div>
                      <p className="text-yellow-600 text-sm mt-1">
                        Le paiement a été effectué. Vous pouvez maintenant
                        publier cette annonce pour qu&apos;elle soit visible par
                        les freelances.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
