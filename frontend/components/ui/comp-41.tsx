"use client";

import { CalendarIcon } from "lucide-react";
import {
  Button,
  DatePicker,
  Dialog,
  Group,
  Popover,
} from "react-aria-components";
import { CalendarDate, parseDate } from "@internationalized/date";

import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}
export function ComponentDatePicker({
  date,
  setDate,
  className,
}: DatePickerProps) {
  const dateValue = date
    ? parseDate(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(date.getDate()).padStart(2, "0")}`,
      )
    : null;

  const handleDateChange = (value: CalendarDate | null) => {
    if (value) {
      // Créer une date en utilisant l'heure locale pour éviter les problèmes de timezone
      const newDate = new Date(
        value.year,
        value.month - 1,
        value.day,
        12,
        0,
        0,
      );
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  return (
    <DatePicker
      className={`*:not-first:mt-2`}
      value={dateValue}
      onChange={handleDateChange}
    >
      <div className="flex">
        <Group className="w-full">
          <DateInput className={`pe-9 ${className || ""}`} />
        </Group>
        <Button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
          <CalendarIcon size={16} />
        </Button>
      </div>
      <Popover
        className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
        offset={4}
      >
        <Dialog className="max-h-[inherit] overflow-auto p-2">
          <Calendar />
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
