const RIGA_TIMEZONE = 'Europe/Riga';

/**
 * Converts a Riga wall-clock datetime string ("DD.MM.YYYY HH:mm") to a UTC timestamp (ms).
 *
 * Works correctly regardless of where the code runs or what the editor's local timezone is.
 * Handles DST automatically: Europe/Riga is UTC+3 (EEST) in summer and UTC+2 (EET) in winter.
 *
 * @param rigaDateTimeStr - e.g. "06.09.2026 09:00" -- always interpreted as Riga time
 * @returns UTC milliseconds
 */
export function rigaTimeToUtcMs(rigaDateTimeStr: string): number {
    // Parse "DD.MM.YYYY HH:mm"
    const [datePart, timePart] = rigaDateTimeStr.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    // Start with a rough UTC estimate treating the input as-if UTC
    const approxUtcMs = Date.UTC(year, month - 1, day, hour, minute);

    // Find what Riga local time is at that approximate UTC moment
    const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: RIGA_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = fmt.formatToParts(approxUtcMs);
    const p = Object.fromEntries(
        parts.filter(x => x.type !== 'literal').map(x => [x.type, x.value])
    );

    // Convert Riga local time back to ms, then compute the true offset (DST-aware)
    const rigaAsUtcMs = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    const rigaOffsetMs = approxUtcMs - rigaAsUtcMs;

    return approxUtcMs + rigaOffsetMs;
}
