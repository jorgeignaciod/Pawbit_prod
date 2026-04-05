"use client";

import { create } from "zustand";

import { CalendarEvent } from "@/types/calendar-event";

interface EventDetailsStore {
  selectedEvent: CalendarEvent | null;
  openEventDetails: (event: CalendarEvent) => void;
  closeEventDetails: () => void;
}

export const useEventDetailsStore = create<EventDetailsStore>((set) => ({
  selectedEvent: null,
  openEventDetails: (event) => set({ selectedEvent: event }),
  closeEventDetails: () => set({ selectedEvent: null })
}));
