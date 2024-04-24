import { DateTime } from "luxon";


const getRelativeDate = (date: string | Date | number) => { 
    const dt = DateTime.fromJSDate(new Date(date));
    const now = DateTime.now().day;
    const diff = now - dt.day;
    if (diff === -1) return "Tomorrow";
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return dt.toFormat("dd LLL, yyyy");
}
export default getRelativeDate;