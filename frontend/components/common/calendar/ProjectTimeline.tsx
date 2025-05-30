"use client";

import { Checkpoint, JobPosting, Quote } from "@/lib/interfaces";
import { useState, useEffect, useMemo, useRef } from "react";

interface ProjectTimelineProps {
  checkpoints?: Checkpoint[];
  daysToShow?: number;
  startDate?: string;
  jobPostings?: JobPosting[];
  quotes?: Quote[];
}

export default function ProjectTimeline({
  checkpoints = [],
  daysToShow = 7,
  startDate,
  jobPostings = [],
  quotes = [],
}: ProjectTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
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

  const statusColorMap = {
    TODO: "blue",
    IN_PROGRESS: "amber",
    DONE: "emerald",
    DELAYED: "red",
    CANCELED: "gray",
  };

  useEffect(() => {
    let calculatedStartPoint: Date;

    if (startDate) {
      calculatedStartPoint = new Date(startDate);
    } else if (checkpoints.length > 0) {
      // Find the oldest date among checkpoints
      const checkpointDates = checkpoints
        .filter((cp) => cp.date)
        .map((cp) => new Date(cp.date).getTime());

      if (checkpointDates.length > 0) {
        calculatedStartPoint = new Date(Math.min(...checkpointDates));
        // Go back a few more days to ensure the first checkpoint is visible
        calculatedStartPoint.setDate(
          calculatedStartPoint.getDate() - (daysToShow > 7 ? daysToShow : 7),
        );
      } else {
        calculatedStartPoint = new Date();
        // Go back a few days even if no checkpoints to show some past dates
        calculatedStartPoint.setDate(
          calculatedStartPoint.getDate() - (daysToShow > 7 ? daysToShow : 7),
        );
      }
    } else {
      calculatedStartPoint = new Date();
      // Go back a few days even if no checkpoints to show some past dates
      calculatedStartPoint.setDate(
        calculatedStartPoint.getDate() - (daysToShow > 7 ? daysToShow : 7),
      );
    }

    setStartPoint(calculatedStartPoint);
  }, [startDate, checkpoints, daysToShow]); // Added daysToShow as a dependency

  useEffect(() => {
    if (!startPoint) return;

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

    for (let i = 0; i < daysToShow; i++) {
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
  }, [startPoint, daysToShow]);

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
      case "DELAYED":
        return "!";
      case "CANCELED":
        return "✕";
      case "TODO":
      default:
        return "○";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto"
      ref={timelineRef}
    >
      {/* Header with days */}
      <div className="flex border-b sticky top-0 bg-white z-10 min-w-full">
        <div className="w-40 flex-shrink-0 px-3 py-3 border-r bg-gray-50 font-medium text-gray-700">
          Postes
        </div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-2 border-r w-20 sm:w-auto ${
              index % 2 === 0 ? "bg-gray-50/50" : ""
            }`}
            style={{ minWidth: "80px" }}
          >
            {day.isFirstOfMonth && (
              <div className="text-xs text-gray-600 font-medium pb-1 border-b border-dashed border-gray-300">
                {day.month}
              </div>
            )}
            <div className="text-sm text-gray-600 font-medium">
              <span className="inline-block min-w-5">{day.code}</span> {day.num}
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
            className="flex border-b relative min-h-24 hover:bg-gray-50/30 transition-colors min-w-full"
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
                  checkpoint.dayIndex >= 0 && checkpoint.dayIndex < days.length;

                if (!isOnTimeline) return null;

                return (
                  <div
                    key={checkpoint.id}
                    className={`absolute w-10 h-10 rounded-full ${colorClasses.bg} border-2 ${colorClasses.border} flex items-center justify-center cursor-pointer z-10 transition-all hover:scale-110 ${colorClasses.hover} shadow-md ${colorClasses.shadow} group`}
                    style={{
                      left: `calc(${
                        ((checkpoint.dayIndex + 0.5) / days.length) * 100
                      }%)`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    title={`${checkpoint.name} (${formatDate(
                      new Date(checkpoint.date).toISOString().split("T")[0],
                    )})`}
                  >
                    <span
                      className={`text-base font-bold ${colorClasses.text}`}
                    >
                      {getStatusIcon(
                        checkpoint.status as keyof typeof statusColorMap,
                      )}
                    </span>

                    {/* Enhanced hover info bubble */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-60 p-3 bg-white shadow-lg rounded-md border border-gray-200 text-sm z-20">
                      <div className={`font-bold mb-1 ${colorClasses.text}`}>
                        {checkpoint.name}
                      </div>
                      <div className="text-gray-700 font-medium">
                        {formatDate(
                          new Date(checkpoint.date).toISOString().split("T")[0],
                        )}
                      </div>
                      <div
                        className={`inline-block px-2 py-0.5 mt-2 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}
                      >
                        {checkpoint.status}
                      </div>
                      {checkpoint.description && (
                        <div className="mt-2 text-gray-600 line-clamp-3">
                          {checkpoint.description}
                        </div>
                      )}
                      {/* Arrow pointing to the checkpoint */}
                      <div className="absolute w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 left-1/2 -bottom-1.5 -ml-1.5"></div>
                    </div>
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
          Aucun checkpoint à afficher
        </div>
      )}
    </div>
  );
}
