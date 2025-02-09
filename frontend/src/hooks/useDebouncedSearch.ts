import { useEffect } from "react";
import { ITasks } from "../types";

export const useDebouncedSearch = (
    searchTerm: string,
    getData: (searchTerm: string) => Promise<ITasks[]>,
    setTasks: (tasks: ITasks[]) => void,
    setFetchedTasks: (tasks: ITasks[]) => void,
    delay = 800
) => {
    useEffect(() => {
        const debounceTimeout = setTimeout(async () => {
            if (searchTerm) {
                const result = await getData(searchTerm);
                setTasks(result);
                setFetchedTasks(result);
            }
        }, delay);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, setTasks, setFetchedTasks, delay]);
};
