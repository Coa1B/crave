const METERS_PER_MILE = 1609.344;

/** 2 → "$$" */
export function priceLabel(price: number) {
  return "$".repeat(Math.min(Math.max(Math.round(price), 1), 4));
}

/** 1290 → "0.8 mi away" (never "0.0"). */
export function milesAway(meters: number) {
  const miles = Math.max(meters / METERS_PER_MILE, 0.1);
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi away`;
}

/** 1240 → "1.2k", 640 → "640" */
export function compactCount(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}

/**
 * Is a place open right now, from hours like "11:00–21:00"?
 * Handles places that close after midnight ("18:00–02:00").
 * Returns null if the hours can't be read.
 */
export function isOpenNow(hours: string, now = new Date()): boolean | null {
  const match = hours.match(/^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const [open, close] = [
    Number(match[1]) * 60 + Number(match[2]),
    Number(match[3]) * 60 + Number(match[4]),
  ];
  const minutes = now.getHours() * 60 + now.getMinutes();
  return close > open ? minutes >= open && minutes < close : minutes >= open || minutes < close;
}
