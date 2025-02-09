import { useEffect } from "react";
import axios from "axios";
import { ITasks } from "../types";

export const useFetchTasksByTag = (
    tags: { work: string; personal: string },
    tagCheckBoxes: { workTagIdIsChecked: boolean; personalTagIdIsChecked: boolean },
    fetchedTasks: ITasks[],
    setTasks: (tasks: ITasks[]) => void
) => {
    useEffect(() => {
        const getTasksByTagId = async () => {
            if (tagCheckBoxes.workTagIdIsChecked === tagCheckBoxes.personalTagIdIsChecked) {
                setTasks([...fetchedTasks]);
            } else {
                const checkboxValue = tags.work ? 1 : 2;
                try {
                    const response = await axios.get(`http://localhost:5000/tasks/tags?tagId=${checkboxValue}`);
                    setTasks(response.data);
                }
                catch (error: unknown) { 
                    if (axios.isAxiosError(error)) { 
                        if (error.response?.status === 404) {
                            console.log("404 Not Found", error.response);
                            setTasks([]);
                        } else {
                            console.error("Axios Error:", error);
                        }
                    } else {
                        console.error("Unknown Error:", error);
                    }
                }
            }
        };

        getTasksByTagId();
    }, [tags.work, tags.personal, tagCheckBoxes, fetchedTasks, setTasks]);
};
