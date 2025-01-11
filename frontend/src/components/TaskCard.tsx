import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { useNavigate, NavigateFunction, useLocation } from 'react-router-dom';
import React, { memo } from "react";
import { TaskCardProps } from '../types';


const TaskCard = ({ task, getTaskToEdit, deleteTask }: TaskCardProps) => {
    const navigate: NavigateFunction = useNavigate();
    const location = useLocation();

    const isOnDetailsPage = location.pathname.includes("/tasks/");
    const handleNavigation = (id:number) => {
        navigate(`/tasks/${id}`);
    };
    return (
            <Card sx={{ marginTop: "15px" }} >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {task?.taskName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {task?.tagId == "1" ? "Work task" : task?.tagId == "2" ? "Personal task" : ""}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {task?.ranktask === "1" ? "Very important" : task?.ranktask === "2" ? "Important" : "Not urgent"} :   {task?.ranktask}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {task?.date?.toString().slice(0, 10)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {task?.filename}
                    </Typography>
                </CardContent>
                <CardActions>
                    {getTaskToEdit && (<Button onClick={() => getTaskToEdit(task?.taskId)} size="small">Edit task</Button>)}

                    {deleteTask && (<Button onClick={() => deleteTask(task?.taskId)} size="small">Delete task</Button>)}
                    {!isOnDetailsPage && (<Button onClick={()=>handleNavigation(task?.taskId)} size="small">See details</Button>)}
                </CardActions>
            </Card>
    )
}
export default memo(TaskCard);