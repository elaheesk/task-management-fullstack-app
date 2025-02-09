import { IInputData, IValidations } from "../types";
import { validations } from "./validations";

export const blurHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    setInputVal: React.Dispatch<React.SetStateAction<IInputData>>
) => {
    const { name, value } = e.target;

    if (name === "tagId" || name === "ranktask") {
        setInputVal((prevForm) => ({
            ...prevForm,
            [name]: {
                hasError: false,
                value: value,
                touched: true,
            },
        }));
    } else {
        const { name, value } = e.target as { name: keyof IValidations; value: string };
        const { isValid, error } = validations[name](value);
        setInputVal((prevForm) => ({
            ...prevForm,
            [name]: {
                ...prevForm[name],
                hasError: !isValid,
                errorMessage: isValid ? "" : error,
                touched: true,
            },
        }));
    }
};