import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTask } from "../dataFetchUtils";
import TaskCard from "../components/TaskCard";
import { ITasks } from "../types";
import Grid from "@mui/material/Grid2";
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

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Link to="/">Back to Tasks</Link>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <TaskCard task={singleTask} />
            </Grid>
        </Grid>
    )
}
export default TaskDetails;