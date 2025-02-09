import { IValidations } from "../types";
import { regexPatterns } from "./regexPatterns";
import { validateDate } from "./validateDate";

export const validations: IValidations = {
    name: (value: string) => ({
        isValid: regexPatterns.name.test(value),
        error: "Enter a valid name",
    }),
    date: (value: string) => ({
        isValid: validateDate(value),
        error: "Enter a valid date",
    }),
};