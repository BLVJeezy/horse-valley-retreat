import { useSyncExternalStore } from "react";
import type { Beds24PropertyKey } from "@/components/site/Beds24Widget";

type ModalState = {
  isOpen: boolean;
  property: Beds24PropertyKey;
};

let state: ModalState = { isOpen: false, property: "horse-vally" };
const listeners = new Set<() => void>();

function setState(partial: Partial<ModalState>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

/** Open de boekingsmodal, optioneel met een vooraf gekozen woning. */
export function openBookingModal(property: Beds24PropertyKey = "horse-vally") {
  setState({ isOpen: true, property });
}

export function closeBookingModal() {
  setState({ isOpen: false });
}

export function setBookingModalProperty(property: Beds24PropertyKey) {
  setState({ property });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

/** React-hook: geeft de actuele modal-state en houdt componenten in sync. */
export function useBookingModalState() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
