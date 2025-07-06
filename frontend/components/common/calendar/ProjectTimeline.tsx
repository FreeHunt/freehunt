"use client";

import { Checkpoint, JobPosting, Quote } from "@/lib/interfaces";
import { useState, useEffect, useMemo, useRef } from "react";

interface ProjectTimelineProps {
  checkpoints?: Checkpoint[];
  daysToShow?: number;
  startDate?: string;
  endDate?: string;
  jobPostings?: JobPosting[];
  quotes?: Quote[];
}

export default function ProjectTimeline({
  checkpoints = [],
  daysToShow = 7,
  startDate,
  endDate,
  jobPostings = [],
  quotes = [],
}: ProjectTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | null>(
    null,
  );
  const [days, setDays] = useState<
    Array<{
      code: string;
      num: string;
      month: string;
      isFirstOfMonth: boolean;
      date: Date;
      fullDate: string;
    }>
  >([]);
  const [rows, setRows] = useState<
    Array<{
      jobPostingId: string;
      jobPosting: JobPosting;
      checkpoints: Array<
        Checkpoint & {
          dayIndex: number;
          jobPosting: JobPosting;
          quoteInfo: Quote | null;
        }
      >;
    }>
  >([]);
  const [startPoint, setStartPoint] = useState<Date | null>(null);
  const [endPoint, setEndPoint] = useState<Date | null>(null);
  const [actualDaysToShow, setActualDaysToShow] = useState<number>(daysToShow);

  const statusColorMap = {
    TODO: "blue",
    IN_PROGRESS: "amber",
    PENDING_COMPANY_APPROVAL: "orange",
    DONE: "emerald",
    DELAYED: "red",
    CANCELED: "gray",
  };

  useEffect(() => {
    let calculatedStartPoint: Date;
    let calculatedEndPoint: Date;
    let calculatedDaysToShow = daysToShow;

    if (checkpoints.length > 0) {
      // Find the oldest and newest dates among checkpoints
      const checkpointDates = checkpoints
        .filter((cp) => cp.date)
        .map((cp) => new Date(cp.date));

      if (checkpointDates.length > 0) {
        const minDate = new Date(
          Math.min(...checkpointDates.map((d) => d.getTime())),
        );
        const maxDate = new Date(
          Math.max(...checkpointDates.map((d) => d.getTime())),
        );

        // Use provided start/end dates or calculate from checkpoints
        if (startDate) {
          calculatedStartPoint = new Date(startDate);
        } else {
          calculatedStartPoint = new Date(minDate);
          // Add some padding before the first checkpoint
          calculatedStartPoint.setDate(calculatedStartPoint.getDate() - 2);
        }

        if (endDate) {
          calculatedEndPoint = new Date(endDate);
        } else {
          calculatedEndPoint = new Date(maxDate);
          // Add some padding after the last checkpoint
          calculatedEndPoint.setDate(calculatedEndPoint.getDate() + 2);
        }

        // Calculate the number of days needed
        const diffTime =
          calculatedEndPoint.getTime() - calculatedStartPoint.getTime();
        calculatedDaysToShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Ensure a minimum number of days for usability
        if (calculatedDaysToShow < 7) {
          calculatedDaysToShow = 7;
          // Center the period around the checkpoints
          const midDate = new Date((minDate.getTime() + maxDate.getTime()) / 2);
          calculatedStartPoint = new Date(midDate);
          calculatedStartPoint.setDate(calculatedStartPoint.getDate() - 3);
          calculatedEndPoint = new Date(calculatedStartPoint);
          calculatedEndPoint.setDate(calculatedEndPoint.getDate() + 6);
        }
      } else {
        // Fallback when no valid checkpoint dates
        calculatedStartPoint = startDate ? new Date(startDate) : new Date();
        calculatedStartPoint.setDate(calculatedStartPoint.getDate() - 3);
        calculatedEndPoint = new Date(calculatedStartPoint);
        calculatedEndPoint.setDate(
          calculatedEndPoint.getDate() + calculatedDaysToShow - 1,
        );
      }
    } else {
      // No checkpoints case
      calculatedStartPoint = startDate ? new Date(startDate) : new Date();
      calculatedStartPoint.setDate(calculatedStartPoint.getDate() - 3);
      calculatedEndPoint = new Date(calculatedStartPoint);
      calculatedEndPoint.setDate(
        calculatedEndPoint.getDate() + calculatedDaysToShow - 1,
      );
    }

    setStartPoint(calculatedStartPoint);
    setEndPoint(calculatedEndPoint);
    setActualDaysToShow(calculatedDaysToShow);
  }, [startDate, endDate, checkpoints, daysToShow]);

  useEffect(() => {
    if (!startPoint || !actualDaysToShow) return;

    const daysList = [];
    const dayCodes = ["D", "L", "M", "M", "J", "V", "S"];
    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    for (let i = 0; i < actualDaysToShow; i++) {
      const currentDate = new Date(startPoint);
      currentDate.setDate(startPoint.getDate() + i);

      daysList.push({
        code: dayCodes[currentDate.getDay()],
        num: String(currentDate.getDate()).padStart(2, "0"),
        month: monthNames[currentDate.getMonth()],
        isFirstOfMonth: currentDate.getDate() === 1,
        date: currentDate,
        fullDate: currentDate.toISOString().split("T")[0],
      });
    }

    setDays(daysList);

    // Scroll to the start (oldest dates) after days are generated
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = 0;
    }
  }, [startPoint, actualDaysToShow]);

  const processedData = useMemo(() => {
    if (days.length === 0) return { rows: [] };

    const getCheckpointDayIndex = (date: Date) => {
      if (!date) return -1;
      const checkpointDate = new Date(date).toISOString().split("T")[0];
      return days.findIndex((day) => day.fullDate === checkpointDate);
    };

    const groupedCheckpoints: { [key: string]: Checkpoint[] } = {};

    checkpoints.forEach((checkpoint) => {
      if (!checkpoint.jobPostingId || !checkpoint.date) return;

      if (!groupedCheckpoints[checkpoint.jobPostingId]) {
        groupedCheckpoints[checkpoint.jobPostingId] = [];
      }
      groupedCheckpoints[checkpoint.jobPostingId].push(checkpoint);
    });

    const checkpointRows: {
      jobPostingId: string;
      jobPosting: JobPosting;
      checkpoints: (Checkpoint & {
        dayIndex: number;
        jobPosting: JobPosting;
        quoteInfo: Quote | null;
      })[];
    }[] = [];

    Object.entries(groupedCheckpoints).forEach(
      ([jobPostingId, jobCheckpoints]) => {
        const jobPosting = jobPostings.find(
          (job) => job.id === jobPostingId,
        ) || { name: "", id: jobPostingId };

        const processedCheckpoints = jobCheckpoints.map((checkpoint) => {
          const dayIndex = getCheckpointDayIndex(new Date(checkpoint.date));

          let quoteInfo = null;
          if (checkpoint.quoteId) {
            quoteInfo = quotes.find((quote) => quote.id === checkpoint.quoteId);
          }

          return {
            ...checkpoint,
            dayIndex: dayIndex >= 0 ? dayIndex : 0,
            jobPosting,
            quoteInfo,
          };
        });

        const sortedCheckpoints = processedCheckpoints.sort(
          (a, b) => a.dayIndex - b.dayIndex,
        );

        checkpointRows.push({
          jobPostingId,
          jobPosting: jobPosting as JobPosting,
          checkpoints: sortedCheckpoints as (Checkpoint & {
            dayIndex: number;
            jobPosting: JobPosting;
            quoteInfo: Quote | null;
          })[],
        });
      },
    );

    const sortedRows = checkpointRows.sort((a, b) => {
      if (a.checkpoints[0] && b.checkpoints[0]) {
        return a.checkpoints[0].dayIndex - b.checkpoints[0].dayIndex;
      }
      return 0;
    });

    return { rows: sortedRows };
  }, [days, checkpoints, jobPostings, quotes]);

  useEffect(() => {
    const currentRows = JSON.stringify(processedData.rows);
    const previousRows = JSON.stringify(rows);

    if (currentRows !== previousRows) {
      setRows(processedData.rows);
    }
  }, [processedData.rows, rows]);

  const getColorClasses = (status: keyof typeof statusColorMap) => {
    const color = statusColorMap[status] || "blue";
    const colorClasses = {
      blue: {
        bg: "bg-blue-200",
        border: "border-blue-600",
        icon: "bg-blue-600",
        text: "text-blue-900",
        hover: "hover:bg-blue-300",
        shadow: "shadow-blue-200",
      },
      emerald: {
        bg: "bg-emerald-200",
        border: "border-emerald-600",
        icon: "bg-emerald-600",
        text: "text-emerald-900",
        hover: "hover:bg-emerald-300",
        shadow: "shadow-emerald-200",
      },
      amber: {
        bg: "bg-amber-200",
        border: "border-amber-600",
        icon: "bg-amber-600",
        text: "text-amber-900",
        hover: "hover:bg-amber-300",
        shadow: "shadow-amber-200",
      },
      orange: {
        bg: "bg-orange-200",
        border: "border-orange-600",
        icon: "bg-orange-600",
        text: "text-orange-900",
        hover: "hover:bg-orange-300",
        shadow: "shadow-orange-200",
      },
      red: {
        bg: "bg-red-200",
        border: "border-red-600",
        icon: "bg-red-600",
        text: "text-red-900",
        hover: "hover:bg-red-300",
        shadow: "shadow-red-200",
      },
      gray: {
        bg: "bg-gray-200",
        border: "border-gray-600",
        icon: "bg-gray-600",
        text: "text-gray-900",
        hover: "hover:bg-gray-300",
        shadow: "shadow-gray-200",
      },
    };
    return colorClasses[color as keyof typeof colorClasses];
  };

  const getStatusIcon = (status: keyof typeof statusColorMap) => {
    switch (status) {
      case "DONE":
        return "✓";
      case "IN_PROGRESS":
        return "▶";
      case "PENDING_COMPANY_APPROVAL":
        return "⏳";
      case "DELAYED":
        return "!";
      case "CANCELED":
        return "✕";
      case "TODO":
      default:
        return "○";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Timeline info header */}
      {checkpoints.length > 0 && (
        <div className="bg-gray-50 border-b px-4 py-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>
              Timeline du projet • {actualDaysToShow} jours •{" "}
              {checkpoints.length} checkpoint{checkpoints.length > 1 ? "s" : ""}
            </span>
            <div className="flex items-center space-x-4">
              {startPoint && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Du{" "}
                  {startPoint.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
              {endPoint && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Au{" "}
                  {endPoint.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scrollable timeline container */}
      <div className="overflow-x-auto" ref={timelineRef}>
        <div className="min-w-full">
          {/* Header with days */}
          <div className="flex border-b sticky top-0 bg-white z-10">
            <div className="w-40 flex-shrink-0 px-3 py-3 border-r bg-gray-50 font-medium text-gray-700">
              Postes
            </div>
            {days.map((day, index) => (
              <div
                key={index}
                className={`flex-1 text-center py-2 border-r w-20 sm:w-auto ${
                  index % 2 === 0 ? "bg-gray-50/50" : ""
                } ${day.isFirstOfMonth ? "border-l-2 border-blue-200" : ""}`}
                style={{ minWidth: "80px" }}
              >
                {day.isFirstOfMonth && (
                  <div className="text-xs text-blue-600 font-semibold pb-1 border-b border-dashed border-blue-300 bg-blue-50 mx-1 rounded-sm">
                    {day.month}
                  </div>
                )}
                <div className="text-sm text-gray-600 font-medium">
                  <span className="inline-block min-w-5">{day.code}</span>{" "}
                  {day.num}
                </div>
              </div>
            ))}
            <div className="w-6 flex-shrink-0 border-r bg-white"></div>
          </div>

          {/* Timeline rows */}
          <div className="relative">
            {rows.map((row, rowIndex) => (
              <div
                key={row.jobPostingId || rowIndex}
                className="flex border-b relative min-h-24 hover:bg-gray-50/30 transition-colors"
              >
                {/* Row label (job name) */}
                <div className="w-40 flex-shrink-0 flex items-center p-3 border-r bg-gray-50">
                  <div className="text-sm font-medium truncate text-gray-800">
                    {row.jobPosting.name}
                  </div>
                </div>

                {/* Cells for each day */}
                <div className="flex-1 flex relative">
                  {days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`border-r ${
                        dayIndex % 2 === 0 ? "bg-gray-50/30" : ""
                      } ${
                        day.isFirstOfMonth ? "border-l-2 border-blue-200" : ""
                      } relative min-h-24`}
                      style={{ flex: "1 0 80px" }}
                    ></div>
                  ))}

                  {/* Connection line between checkpoints */}
                  {row.checkpoints.length > 1 && (
                    <div className="absolute top-1/2 h-1 bg-gray-300 w-full transform -translate-y-1/2 z-0"></div>
                  )}

                  {/* Checkpoints in this row */}
                  {row.checkpoints.map((checkpoint) => {
                    const colorClasses = getColorClasses(
                      checkpoint.status as keyof typeof statusColorMap,
                    );
                    const isOnTimeline =
                      checkpoint.dayIndex >= 0 &&
                      checkpoint.dayIndex < days.length;

                    if (!isOnTimeline) return null;

                    const isSelected = selectedCheckpoint === checkpoint.id;

                    return (
                      <div
                        key={checkpoint.id}
                        className={`absolute w-10 h-10 rounded-full ${
                          colorClasses.bg
                        } border-2 ${
                          colorClasses.border
                        } flex items-center justify-center cursor-pointer z-10 transition-all transform hover:scale-110 ${
                          colorClasses.hover
                        } shadow-md ${colorClasses.shadow} ${
                          isSelected ? "scale-125 ring-4 ring-blue-200" : ""
                        }`}
                        style={{
                          left: `calc(${
                            ((checkpoint.dayIndex + 0.5) / days.length) * 100
                          }%)`,
                          top: "50%",
                          transform: `translate(-50%, -50%) ${
                            isSelected ? "scale(1.25)" : ""
                          }`,
                        }}
                        onClick={() =>
                          setSelectedCheckpoint(
                            selectedCheckpoint === checkpoint.id
                              ? null
                              : checkpoint.id,
                          )
                        }
                        title={`Cliquer pour voir les détails de: ${checkpoint.name}`}
                      >
                        <span
                          className={`text-base font-bold ${colorClasses.text}`}
                        >
                          {getStatusIcon(
                            checkpoint.status as keyof typeof statusColorMap,
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Message if no checkpoints */}
          {checkpoints.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-medium">Aucun checkpoint à afficher</p>
              <p className="text-sm mt-1">
                Les checkpoints apparaîtront ici une fois ajoutés au projet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-gray-50 border-t px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-gray-600 font-medium">Légende:</span>
          {Object.entries(statusColorMap).map(([status]) => {
            const colorClasses = getColorClasses(
              status as keyof typeof statusColorMap,
            );
            return (
              <div key={status} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${colorClasses.bg} border ${colorClasses.border} flex items-center justify-center`}
                >
                  <span className={`text-xs ${colorClasses.text}`}>
                    {getStatusIcon(status as keyof typeof statusColorMap)}
                  </span>
                </div>
                <span className="text-gray-700">
                  {status === "TODO"
                    ? "À faire"
                    : status === "IN_PROGRESS"
                    ? "En cours"
                    : status === "PENDING_COMPANY_APPROVAL"
                    ? "En attente validation"
                    : status === "DONE"
                    ? "Terminé"
                    : status === "DELAYED"
                    ? "Retardé"
                    : status === "CANCELED"
                    ? "Annulé"
                    : status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Checkpoint Details Panel */}
      {selectedCheckpoint &&
        (() => {
          const selectedCheckpointData = checkpoints.find(
            (cp) => cp.id === selectedCheckpoint,
          );
          if (!selectedCheckpointData) return null;

          const colorClasses = getColorClasses(
            selectedCheckpointData.status as keyof typeof statusColorMap,
          );

          return (
            <div className="border-t bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Détails du checkpoint
                  </h3>
                  <button
                    onClick={() => setSelectedCheckpoint(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Fermer les détails"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Checkpoint Name */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-gray-900">
                        Nom du checkpoint
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedCheckpointData.name}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-gray-900">
                        Date d&apos;échéance
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {new Date(selectedCheckpointData.date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <div className={`${colorClasses.bg} p-4 rounded-lg`}>
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-gray-900">Statut</span>
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${colorClasses.text} border ${colorClasses.border}`}
                    >
                      <span className="mr-2">
                        {getStatusIcon(
                          selectedCheckpointData.status as keyof typeof statusColorMap,
                        )}
                      </span>
                      {selectedCheckpointData.status === "TODO"
                        ? "À faire"
                        : selectedCheckpointData.status === "IN_PROGRESS"
                        ? "En cours"
                        : selectedCheckpointData.status === "PENDING_COMPANY_APPROVAL"
                        ? "En attente validation"
                        : selectedCheckpointData.status === "DONE"
                        ? "Terminé"
                        : selectedCheckpointData.status === "DELAYED"
                        ? "Retardé"
                        : selectedCheckpointData.status === "CANCELED"
                        ? "Annulé"
                        : selectedCheckpointData.status}
                    </div>
                  </div>

                  {/* Amount */}
                  {selectedCheckpointData.amount && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-5 h-5 mr-2 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-gray-900">
                          Montant
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-green-600">
                        {selectedCheckpointData.amount.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {selectedCheckpointData.description && (
                    <div className="bg-yellow-50 p-4 rounded-lg md:col-span-2 lg:col-span-3">
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-5 h-5 mr-2 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-gray-900">
                          Description
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCheckpointData.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
