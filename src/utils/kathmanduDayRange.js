const KATHMANDU_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const getKathmanduDayRange = (now = new Date()) => {
    const dateParts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kathmandu',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(now);
    const parts = Object.fromEntries(
        dateParts.map(({ type, value }) => [type, value])
    );
    const localDate = `${parts.year}-${parts.month}-${parts.day}`;
    const start = new Date(
        Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) -
            KATHMANDU_OFFSET_MS
    );

    return {
        localDate,
        start,
        end: new Date(start.getTime() + DAY_MS),
    };
};

module.exports = getKathmanduDayRange;
