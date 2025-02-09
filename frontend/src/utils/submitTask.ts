import { postOrEditTasks } from "../utils/dataFetchUtils";
import { FileMetadata, IInputData, ITasks } from "../types";

export const submitTask = async (
    inputVal: IInputData,
    newFile: File | null,
    existingFile: FileMetadata | null,
    setTasks: (tasks: ITasks[]) => void,
    setFetchedTasks: (tasks: ITasks[]) => void
) => {
    const formData = new FormData();
    formData.append("taskName", inputVal.name.value);
    formData.append("date", inputVal.date.value);
    formData.append("ranktask", inputVal.ranktask.value);
    formData.append("tagId", inputVal.tagId.value);

    if (!inputVal.id.value) {
        if (newFile) {
            formData.append("file", newFile);
        }

        try {
            const response = await postOrEditTasks(formData, "POST");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setTasks(data);
            setFetchedTasks(data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    } else {
        formData.append("taskId", inputVal.id.value);

        if (!existingFile && !newFile) {
            formData.append("removeFile", "true");
        } else if (newFile) {
            formData.append("file", newFile);
        }

        try {
            const response = await postOrEditTasks(formData, "PUT");
            const data = await response.json();
            setTasks(data);
            setFetchedTasks(data);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }
};