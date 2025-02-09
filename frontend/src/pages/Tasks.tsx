import { useCallback, ChangeEvent } from "react";
import Form from "../components/Form";
import Grid from '@mui/material/Grid2';
import TaskCard from "../components/TaskCard";
import RadioButton from "../components/RadioButton";
import { getData, getTaskToDelete, getTask } from "../utils/dataFetchUtils";
import { sortFunction } from "../utils";
import { ITasks } from "../types";
import { Box, Typography, Checkbox, TextField } from '@mui/material';
import Item from "../components/Item";
import { blurHandler } from "../utils/blurHandler";
import { useTaskState } from "../hooks/useTaskState";
import { validateForm } from "../utils/validateForm";
import { submitTask } from "../utils/submitTask";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { useTags } from "../hooks/useTags";
import { useFetchTasksByTag } from "../hooks/useFetchTasksByTag";


const Tasks = () => {
    const {
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
    } = useTaskState();


    const getTaskToEdit = async (id: number) => {
        const response = await getTask(id);
        setInputVal({
            id: { value: response.taskId, hasError: false, touched: false },
            name: { value: response.taskName, hasError: false, touched: false },
            date: { value: response.date.slice(0, 10), hasError: false, touched: false },
            ranktask: { value: response.ranktask, hasError: false, touched: false },
            tagId: { value: response.tagId.toString(), hasError: false, touched: false }
        });
        if (response.filename) {
            setExistingFile({
                name: response.filename,
                type: response.filetype,
                size: response.filesize,
                path: response.filepath,
            });
        } else {
            setExistingFile(null);
        }
    };

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setInputVal((prevForm) => ({
            ...prevForm,
            [name]: {
                ...prevForm[name],
                value: value,
                touched: true,
            },
        }));
    }, [inputVal]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { isValid, updatedForm } = validateForm(inputVal);
        setInputVal(updatedForm);

        if (!isValid) {
            setStatus("Please fill in all required fields correctly.");
            return;
        }

        await submitTask(inputVal, newFile, existingFile, setTasks, setFetchedTasks);

        setInputVal({
            id: { value: "", hasError: false, touched: false },
            name: { value: "", hasError: false, touched: false },
            date: { value: "", hasError: false, touched: false },
            ranktask: { value: "", hasError: false, touched: false },
            tagId: { value: "", hasError: false, touched: false },
        });
        setNewFile(null);
        setExistingFile(null);
        setStatus("");
    };


    const deleteTask = useCallback(async (id: number) => {
        try {
            const response = await getTaskToDelete(id);
            if (response.statusText === "OK") {
                const updatedTasks = tasks.filter((task: ITasks) => task.taskId !== id);
                setTasks(updatedTasks);
                setFetchedTasks(updatedTasks);
            }
        } catch (error) {
            alert("Failed to delete the task. Please try again.");
        }
    }, [tasks]);




    useDebouncedSearch(searchTerm, getData, setTasks, setFetchedTasks);
    useTags(tagCheckBoxes, setTags);
    useFetchTasksByTag(tags, tagCheckBoxes, fetchedTasks, setTasks);


    const handleSortTasks = (e:ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSelectedValue(value)
        if (fetchedTasks.length > 0) {
            const response = sortFunction(fetchedTasks, value);
            setTasks(response);
        }
    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Item><Typography variant="h3" fontSize="sm" color="gray">Create your Task list</Typography></Item>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Form status={status} blurHandler={blurHandler} handleOnChange={handleOnChange} newFile={newFile} inputVal={inputVal} handleSubmit={handleSubmit} setNewFile={setNewFile} existingFile={existingFile} setExistingFile={setExistingFile} />
                </Grid>
              
                <Grid size={{ xs: 6, md: 9 }}>
                    <Grid container direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "stretch",
                        }}>
                        <TextField
                            id="standard-textarea"
                            label="Search"
                            placeholder="Search"
                            multiline
                            variant="standard"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Grid container
                            direction="row"
                            sx={{
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                            }}>
                            <RadioButton radioName="sortTasks" radioValue="ascName" radioLabel="Name A-Z" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "ascName"} />
                            <RadioButton radioName="sortTasks" radioValue="descName" radioLabel="Name Z-A" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "descName"} />
                            <RadioButton radioName="sortTasks" radioValue="ascDate" radioLabel="Oldest" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "ascDate"} />
                            <RadioButton radioName="sortTasks" radioValue="descDate" radioLabel="Most recent" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "descDate"} />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        sx={{ alignItems: "flex-start" }}>
                        <Grid>
                            Work tasks
                            <Checkbox size="small" value="1" onChange={() => setTagCheckBoxes({ ...tagCheckBoxes, workTagIdIsChecked: !tagCheckBoxes.workTagIdIsChecked })} />
                        </Grid>
                        <Grid>
                            Personal tasks
                            <Checkbox size="small" value="2" onChange={() => setTagCheckBoxes({ ...tagCheckBoxes, personalTagIdIsChecked: !tagCheckBoxes.personalTagIdIsChecked })} />
                        </Grid>
                    </Grid>
                    <Grid container direction="row"
                        sx={{ justifyContent: "space-between", alignItems: "stretch" }}>
                        {tasks.map((task: ITasks) => (
                            <TaskCard key={task.taskId} task={task} getTaskToEdit={getTaskToEdit} deleteTask={deleteTask} />
                        ))}
                    </Grid>
                    button</Grid>
            </Grid>
        </Box>
    );
};

export default Tasks;
