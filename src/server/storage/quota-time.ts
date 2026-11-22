/** Accept a device's named time zone, never its clock or an arbitrary offset. */
export function validTimeZone(value: string): string {
  if (value.length > 100 || !/^[A-Za-z_]+(?:\/[A-Za-z0-9_+\-]+)*$/.test(value))
    throw new Error("INVALID_INPUT");
  try {
    return new Intl.DateTimeFormat("en", { timeZone: value }).resolvedOptions()
      .timeZone;
  } catch {
    throw new Error("INVALID_INPUT");
  }
}

/** Calendar boundaries come from the runtime's time-zone data, not a fixed offset. */
export function quotaWindow(
  now: number,
  timeZone: string,
): { start: number; end: number } {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    calendar: "gregory",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const today = date.format(now);
  const second = Math.floor(now / 1000);
  let left = second - 172800;
  let right = second;
  while (right - left > 1) {
    const middle = Math.floor((left + right) / 2);
    if (date.format(middle * 1000) === today) right = middle;
    else left = middle;
  }
  const start = right * 1000;
  left = second;
  right = second + 172800;
  while (right - left > 1) {
    const middle = Math.floor((left + right) / 2);
    if (date.format(middle * 1000) === today) left = middle;
    else right = middle;
  }
  return { start, end: right * 1000 };
}
