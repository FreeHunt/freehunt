import { useState, useEffect } from "react";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Checkpoint } from "@/lib/interfaces";

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
  });

  useEffect(() => {
    if (!checkpoints || checkpoints.length === 0) return;

    const total = checkpoints.length;
    const done = checkpoints.filter((cp) => cp.status === "DONE").length;
    const inProgress = checkpoints.filter(
      (cp) => cp.status === "IN_PROGRESS",
    ).length;
    const todo = checkpoints.filter((cp) => cp.status === "TODO").length;

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
    });
  }, [checkpoints]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Carte - Total des checkpoints */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total checkpoints</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>

        {/* Carte - Checkpoints complétés */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Complétés</p>
            <p className="text-2xl font-bold">{stats.done}</p>
          </div>
        </div>

        {/* Carte - Checkpoints en cours */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">En cours</p>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </div>
        </div>

        {/* Carte - Taux de complétion */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">À faire</p>
            <p className="text-2xl font-bold">{stats.todo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
