import { useState } from "react";
import { FileMetadata, IInputData, ITasks } from "../types";

export const useTaskState = () => {
    const [fetchedTasks, setFetchedTasks] = useState<ITasks[]>([]);
    const [tasks, setTasks] = useState<ITasks[]>([]);
    const [status, setStatus] = useState("");

    const [inputVal, setInputVal] = useState<IInputData>({
        id: { value: "", hasError: false, touched: false },
        name: { value: "", hasError: false, touched: false },
        date: { value: "", hasError: false, touched: false },
        ranktask: { value: "", hasError: false, touched: false },
        tagId: { value: "", hasError: false, touched: false },
    });

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [tagCheckBoxes, setTagCheckBoxes] = useState({
        workTagIdIsChecked: false,
        personalTagIdIsChecked: false
    });

    const [tags, setTags] = useState({ work: "", personal: "" });
    const [existingFile, setExistingFile] = useState<FileMetadata | null>(null);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [selectedValue, setSelectedValue] = useState("");

    return {
        fetchedTasks, setFetchedTasks,
        tasks, setTasks,
        status, setStatus,
        inputVal, setInputVal,
        searchTerm, setSearchTerm,
        tagCheckBoxes, setTagCheckBoxes,
        tags, setTags,
        existingFile, setExistingFile,
        newFile, setNewFile,
        selectedValue, setSelectedValue
    };
};
