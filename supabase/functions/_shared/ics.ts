// Minimal ICS (iCalendar) parsing/generation helpers.
// Deliberately dependency-free: Airbnb/Booking.com export a small, predictable
// subset of the spec (VEVENT blocks with DTSTART/DTEND/UID), so a full RFC 5545
// parser is not needed here.

export interface IcsEvent {
  uid: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (exclusive, per ICS convention for all-day events)
  summary?: string;
}

/** Unfolds ICS line continuations (lines starting with a space are continuations). */
function unfold(raw: string): string[] {
  const lines = raw.split(/\r\n|\n|\r/);
  const out: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length > 0) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function toIsoDate(value: string): string {
  // Handles both DATE (YYYYMMDD) and DATE-TIME (YYYYMMDDTHHMMSSZ) forms.
  const digits = value.replace(/[^0-9]/g, "").slice(0, 8);
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function parseIcs(raw: string): IcsEvent[] {
  const lines = unfold(raw);
  const events: IcsEvent[] = [];
  let current: Partial<IcsEvent> | null = null;

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      current = {};
      continue;
    }
    if (line.startsWith("END:VEVENT")) {
      if (current?.uid && current.startDate && current.endDate) {
        events.push(current as IcsEvent);
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const [rawKey, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    const key = rawKey.split(";")[0].toUpperCase();

    if (key === "UID") current.uid = value.trim();
    else if (key === "DTSTART") current.startDate = toIsoDate(value);
    else if (key === "DTEND") current.endDate = toIsoDate(value);
    else if (key === "SUMMARY") current.summary = value.trim();
  }

  return events;
}

export function buildIcs(
  events: { uid: string; startDate: string; endDate: string; summary: string }[],
  calendarName: string,
): string {
  const esc = (s: string) => s.replace(/([,;])/g, "\\$1");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Solyn Global//Horse Valley Retreat//NL",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${esc(calendarName)}`,
  ];
  for (const ev of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTART;VALUE=DATE:${ev.startDate.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${ev.endDate.replace(/-/g, "")}`,
      `SUMMARY:${esc(ev.summary)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
