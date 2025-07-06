import { Checkpoint } from "@/lib/interfaces";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Composant pour afficher les statistiques des checkpoints
export default function CheckpointStats({
  checkpoints,
}: {
  checkpoints: Checkpoint[];
}) {
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    inProgress: 0,
    todo: 0,
    completionRate: 0,
    totalAmount: 0,
    completedAmount: 0,
  });

  useEffect(() => {
    if (!checkpoints || checkpoints.length === 0) return;

    const total = checkpoints.length;
    const done = checkpoints.filter((cp) => cp.status === "DONE").length;
    const inProgress = checkpoints.filter(
      (cp) => cp.status === "IN_PROGRESS",
    ).length;
    const todo = checkpoints.filter((cp) => cp.status === "TODO").length;

    // Calculer les montants
    const totalAmount = checkpoints.reduce(
      (sum, cp) => sum + (cp.amount || 0),
      0,
    );
    const completedAmount = checkpoints
      .filter((cp) => cp.status === "DONE")
      .reduce((sum, cp) => sum + (cp.amount || 0), 0);

    // Regrouper par jobPostingId
    const jobCounts: Record<string, number> = {};
    checkpoints.forEach((cp) => {
      if (!jobCounts[cp.jobPostingId]) {
        jobCounts[cp.jobPostingId] = 0;
      }
      jobCounts[cp.jobPostingId]++;
    });

    setStats({
      total,
      done,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      totalAmount,
      completedAmount,
    });
  }, [checkpoints]);

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto gap-4 mb-6 pb-2">
        <div className="flex gap-4 min-w-max">
        {/* Carte - Total des checkpoints */}
        <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col items-center border border-border hover:shadow-md transition-shadow min-w-[140px]">
          <div className="rounded-full bg-purple-100 p-3 mb-3">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        {/* Carte - Checkpoints complétés */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center border border-gray-200 hover:shadow-md transition-shadow min-w-[140px]">
          <div className="rounded-full bg-green-100 p-3 mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Terminés
            </p>
            <p className="text-2xl font-bold text-green-600">{stats.done}</p>
          </div>
        </div>

        {/* Carte - Checkpoints en cours */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center border border-gray-200 hover:shadow-md transition-shadow min-w-[140px]">
          <div className="rounded-full bg-blue-100 p-3 mb-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              En cours
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </p>
          </div>
        </div>

        {/* Carte - À faire */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center border border-gray-200 hover:shadow-md transition-shadow min-w-[140px]">
          <div className="rounded-full bg-amber-100 p-3 mb-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              À faire
            </p>
            <p className="text-2xl font-bold text-amber-600">{stats.todo}</p>
          </div>
        </div>

        {/* Carte - Montant total */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center border border-gray-200 hover:shadow-md transition-shadow min-w-[160px]">
          <div className="rounded-full bg-indigo-100 p-3 mb-3">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Montant total
            </p>
            <p className="text-lg font-bold text-indigo-600 whitespace-nowrap">
              {stats.totalAmount.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </div>
        </div>

        {/* Carte - Montant gagné */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center border border-gray-200 hover:shadow-md transition-shadow min-w-[160px]">
          <div className="rounded-full bg-emerald-100 p-3 mb-3">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Montant gagné
            </p>
            <p className="text-lg font-bold text-emerald-600 whitespace-nowrap">
              {stats.completedAmount.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Barre de progression */}
      {stats.total > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              Progression du projet
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {stats.completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>
              {stats.done} checkpoint{stats.done !== 1 ? "s" : ""} terminé
              {stats.done !== 1 ? "s" : ""}
            </span>
            <span>
              {stats.total - stats.done} restant
              {stats.total - stats.done !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
