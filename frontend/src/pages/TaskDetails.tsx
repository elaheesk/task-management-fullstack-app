import React, { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import { getTask } from "../dataFetchUtils";
import TaskCard from "../components/TaskCard";
import { ITasks } from "../types";
const TaskDetails = () => {
    const [singleTask, setSingleTask] = useState<ITasks>();
    const { id } = useParams();

    useEffect(() => {
        const getTaskDetails = async () => {
            const response = await getTask(id);
         
            setSingleTask(response)
        }
        getTaskDetails();
    }, [])
    return (<div>
        <Link to="/">Back to Tasks</Link>
        <TaskCard task={singleTask} />
    </div>)
}
export default TaskDetails;