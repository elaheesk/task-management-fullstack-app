import axios from "axios";
import { useEffect, useState, useCallback, ChangeEvent } from "react";
import Form from "../components/Form";
import Grid from '@mui/material/Grid2';
import TaskCard from "../components/TaskCard";
import RadioButton from "../components/RadioButton";
import { getData, getTaskToDelete, getTask, postOrEditTasks } from "../dataFetchUtils";
import { sortFunction } from "../utils";
import { FileMetadata, IInputData, ITasks, IValidations } from "../types";
import { Box, Paper, Typography, Checkbox, TextField, styled } from '@mui/material';


const Tasks = () => {
    const [fetchedTasks, setFetchedTasks] = useState<ITasks[]>([]);
    const [tasks, setTasks] = useState<ITasks[]>([]);
    const [status, setStatus] = useState("");
    const [inputVal, setInputVal] = useState<IInputData>({
        id: { value: "", hasError: false, touched: false },
        name: { value: "", hasError: false, touched: false },
        date: { value: "", hasError: false, touched: false },
        ranktask: { value: "", hasError: false, touched: false },
        tagId: { value: "", hasError: false, touched: false }
    });

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [tagCheckBoxes, setTagCheckBoxes] = useState({ workTagIdIsChecked: false, personalTagIdIsChecked: false });
    const [tags, setTags] = useState({ work: "", personal: "" });
    const [existingFile, setExistingFile] = useState<FileMetadata | null>(null);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [selectedValue, setSelectedValue] = useState("");


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

    const handleOnChange = useCallback((e: any) => {
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


    const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target; 

        if (name === "tagId") {
            setInputVal((prevForm) => ({
                ...prevForm,
                tagId: {
                    hasError: false,
                    value: value,
                    touched: true,
              
                },
            }));
        } else if (name === "ranktask") {
            setInputVal((prevForm) => ({
                ...prevForm,
                ranktask: {
                    hasError: false,
                    value: value,
                    touched: true,
                },
            }));
        } else {
            const { name, value } = e.target as { name: keyof IValidations; value: string };
            const { isValid, error } = validations[name](value);
            setInputVal((prevForm: IInputData) => ({
                ...prevForm,
                [name]: {
                    ...prevForm[name],
                    hasError: !isValid,
                    errorMessage: isValid ? "" : error,
                    touched: true,
                },
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
   
        const isFormValid = Object.entries(inputVal)
            .filter(([key]) => key !== "id") // Exclude the 'id' field
            .every(([_, input]) => !input.hasError && input.touched);

        if (isFormValid) {
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

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setTasks(data);
                    setFetchedTasks(data);
                } catch (error) {
                    console.error("Error submitting form:", error);
                }
            }


            else if (inputVal.id.value) {
                formData.append("taskId", inputVal.id.value);
                if (existingFile === null && newFile === null) {
                    formData.append("removeFile", "true");
                } else if (newFile) {
                    formData.append("file", newFile);
                }
                const response = await postOrEditTasks(formData, "PUT");
                const data = await response.json();
                setTasks(data);
                setFetchedTasks(data);
            }

            setInputVal({
                id: { value: "", hasError: false, touched: false },
                name: { value: "", hasError: false, touched: false },
                date: { value: "", hasError: false, touched: false },
                ranktask: { value: "", hasError: false, touched: false },
                tagId: { value: "", hasError: false, touched: false }
            })
            setNewFile(null);
            setExistingFile(null);
            setStatus("");
        } else {
            setInputVal((prevForm) => ({
                ...prevForm,
                tagId: {
                    hasError: !inputVal.tagId.value ? true : false, 
                    value: inputVal.tagId.value,
                    touched: !inputVal.tagId.value ? false : true,
                    errorMessage: !inputVal.tagId.value ? "Please choose what kind of taskit is" : "",
                },
                ranktask: {
                    hasError: !inputVal.ranktask.value ? true : false,
                    value: inputVal.ranktask.value,
                    touched: !inputVal.ranktask.value ? false : true,
                    errorMessage: !inputVal.ranktask.value ? "Please choose a ranking" : "",
                },
                date: {
                    hasError: !inputVal.date.value ? true : false,
                    value: inputVal.date.value,
                    touched: !inputVal.date.value ? false : true,
                    errorMessage: !inputVal.date.value ? "Please enter a date" : "",
                },
                name: {
                    hasError: !inputVal.name.value ? true : false,
                    value: inputVal.name.value,
                    touched: !inputVal.name.value ? false : true,
                    errorMessage: !inputVal.name.value ? "Please choose a task" : "",
                },
            }));
            setStatus("Please fill in all required fields correctly.");
        }

    }


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


    useEffect(() => {
        const debounceTimeout = setTimeout(async () => {

            const result = await getData(searchTerm);
            setTasks(result);
            setFetchedTasks(result)

        }, 800);

        return () => clearTimeout(debounceTimeout)
    }, [searchTerm])

    useEffect(() => {
        setTags({
            work: tagCheckBoxes.workTagIdIsChecked ? "1" : "",
            personal: tagCheckBoxes.personalTagIdIsChecked ? "2" : ""
        })
    }, [tagCheckBoxes.workTagIdIsChecked, tagCheckBoxes.personalTagIdIsChecked]);

    useEffect(() => {
        const getTasksByTagId = async () => {
            if (tagCheckBoxes.workTagIdIsChecked === tagCheckBoxes.personalTagIdIsChecked) {
                setTasks([...fetchedTasks]);
            } else {
                let checkboxValue;
                if (tags.work) {
                    checkboxValue = 1;
                } else {
                    checkboxValue = 2;
                }
                try {
                    const response = await axios.get(`http://localhost:5000/tasks/tags?tagId=${checkboxValue}`);
                    setTasks(response.data);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.log("404 Not Found", error.response);
                        setTasks([]);
                    } else {
                        console.error("Error fetching tasks by tag ID:", error);
                    }
                }
            }
        }
        getTasksByTagId();
    }, [tags.work, tags.personal]);


    const handleSortTasks = (e:ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSelectedValue(value)
        if (fetchedTasks.length > 0) {
            const response = sortFunction(fetchedTasks, value);
            setTasks(response);
        }
    }
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
        }),
    }));

    function validateDate(input:string) {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

        if (!regex.test(input)) {
            return false;
        }

        const [year, month, day] = input.split('-').map(Number);

        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }

    const validations: IValidations = {
        name: (value: string) => ({
            isValid: /^[0-9A-Za-z\s]{3,25}$/.test(value),
            error: "Enter enter a task",
        }),
        date: (value: string) => ({
            isValid: validateDate(value),
            error: "Enter a valid date",
        })
       
    };

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
