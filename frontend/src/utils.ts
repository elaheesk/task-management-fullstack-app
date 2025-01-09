import { ITasks } from "./types";

export const sortFunction = (fetchedTasks: ITasks[], value: string) => {
    const sortedTasks = [...fetchedTasks].sort((a, b) => {
        switch (value) {
            case "ascName":

                return a.taskName.localeCompare(b.taskName)
            case "descName":
                return b.taskName.localeCompare(a.taskName)
            case "ascDate":
                return a.date.toString().slice(0, 10).localeCompare(b.date.toString().slice(0, 10))

            case "descDate":
                return b.date.toString().slice(0, 10).localeCompare(a.date.toString().slice(0, 10))
        }
    });
    return sortedTasks;
}