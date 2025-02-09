import { regexPatterns } from "./regexPatterns";

export function validateDate(input: string): boolean {
    if (!regexPatterns.date.test(input)) {
        return false;
    }

    const [year, month, day] = input.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}
