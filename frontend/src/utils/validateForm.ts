import { IInputData } from "../types";

export const validateForm = (inputVal: IInputData) => {
    const isValid = Object.entries(inputVal)
        .filter(([key]) => key !== "id") // Exclude 'id' field
        .every(([_, input]) => !input.hasError && input.touched);

    if (!isValid) {
        return {
            isValid: false,
            updatedForm: {
                ...inputVal,
                tagId: {
                    ...inputVal.tagId,
                    hasError: !inputVal.tagId.value,
                    errorMessage: !inputVal.tagId.value ? "Please choose what kind of task it is" : "",
                    touched: !!inputVal.tagId.value,
                },
                ranktask: {
                    ...inputVal.ranktask,
                    hasError: !inputVal.ranktask.value,
                    errorMessage: !inputVal.ranktask.value ? "Please choose a ranking" : "",
                    touched: !!inputVal.ranktask.value,
                },
                date: {
                    ...inputVal.date,
                    hasError: !inputVal.date.value,
                    errorMessage: !inputVal.date.value ? "Please enter a date" : "",
                    touched: !!inputVal.date.value,
                },
                name: {
                    ...inputVal.name,
                    hasError: !inputVal.name.value,
                    errorMessage: !inputVal.name.value ? "Please enter a task name" : "",
                    touched: !!inputVal.name.value,
                },
            },
        };
    }

    return { isValid: true, updatedForm: inputVal };
};