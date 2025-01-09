import axios from "axios";
import { useEffect, useState useCallback } from "react";
import Form from "../components/Form";
import Grid from '@mui/material/Grid2';
import TextField from "@mui/material/TextField/TextField";
import Checkbox from "@mui/material/Checkbox";
import TaskCard from "../components/TaskCard";
import RadioButton from "../components/RadioButton";
import { getData, getTaskToDelete, getTask, postOrEditTasks } from "../dataFetchUtils";
import { sortFunction } from "../utils";
import { FileMetadata, ITasks } from "../types";
import Typography from "@mui/material/Typography";


const Tasks = () => {
    const [fetchedTasks, setFetchedTasks] = useState<ITasks[]>([]);
    const [tasks, setTasks] = useState<ITasks[]>([]);
    const [inputVal, setInputVal] = useState({ id: "", name: "", date: "", ranktask: "", tagId: "" });
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [tagCheckBoxes, setTagCheckBoxes] = useState({ workTagIdIsChecked: false, personalTagIdIsChecked: false });
    const [tags, setTags] = useState({ work: "", personal: "" });
    const [existingFile, setExistingFile] = useState<FileMetadata | null>(null);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [selectedValue, setSelectedValue] = useState("");
    const [errorMessages, setErrorMessages] = useState({
        nameError: "",
        dateError: "",
        tagIdError: "",
        ranktaskError: ""
    })

    const getTaskToEdit = async (id: number) => {
        const response = await getTask(id);
        setInputVal({ id: response.taskId, name: response.taskName, date: response.date.slice(0, 10), ranktask: response.ranktask, tagId: response.tagId.toString() });
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

  

    const handleOnChange = useCallback((e:any) => {
        const { value, name } = e.target;
        setInputVal({
            ...inputVal,
            [name]: name === "date" ? value : value,
        })
    }, [inputVal])


    const handleSubmit = async (e: any) => {
        e.preventDefault();
 
        if (inputVal.name === "" || inputVal.date === "" || inputVal.tagId === "" || inputVal.ranktask === "") {
            setErrorMessages({
                nameError: inputVal.name === "" ? "you have enter a task" : "",
                dateError: inputVal.date === "" ? "you have to enter a date" : "",
                tagIdError: inputVal.tagId === "" ? "you have to choose type of task" : "",
                ranktaskError: inputVal.ranktask === "" ? "you have to rank the task" : "",
            })
            return;
        } else {
            const formData = new FormData();
            formData.append("taskName", inputVal.name);
            formData.append("date", inputVal.date);
            formData.append("ranktask", inputVal.ranktask);
            formData.append("tagId", inputVal.tagId);
            if (!inputVal.id) {

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

            else if (inputVal.id) {
                formData.append("taskId", inputVal.id);
                if (existingFile === null && newFile === null) {
                    // File removed and no new file uploaded
                    formData.append("removeFile", "true");
                } else if (newFile) {
                    // New file uploaded
                    formData.append("file", newFile);
                }
                const response = await postOrEditTasks(formData, "PUT");
                const data = await response.json();
                setTasks(data);
                setFetchedTasks(data);
            }
            setInputVal({ id: "", name: "", date: "", ranktask: "", tagId: "" });
            setNewFile(null);
            setExistingFile(null);
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
                    console.log("response issssssssssssss", response);
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


    const handleSortTasks = (e: any) => {
        const { value } = e.target;
        setSelectedValue(value)
        if (fetchedTasks.length > 0) {
            const response = sortFunction(fetchedTasks, value);
            setTasks(response);
        }
    }


    return (
        <div>
            <div style={{ width: "300px" }}>
                <Typography variant="h3" fontSize="sm" color="gray">Create your Task list</Typography>
                <Form handleOnChange={handleOnChange} newFile={newFile} inputVal={inputVal} handleSubmit={handleSubmit} setNewFile={setNewFile} existingFile={existingFile} setExistingFile={setExistingFile} errorMessages={errorMessages} />
       </div>
            <Grid container spacing={6}>
                <Grid size={2}>
                    <TextField
                        id="standard-textarea"
                        label="Search"
                        placeholder="Search"
                        multiline
                        variant="standard"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid size={6}>
                    <label>Work tasks</label>
                    <Checkbox value="1" onChange={() => setTagCheckBoxes({ ...tagCheckBoxes, workTagIdIsChecked: !tagCheckBoxes.workTagIdIsChecked })} />
                    <label>Personal tasks</label>
                    <Checkbox value="2" onChange={() => setTagCheckBoxes({ ...tagCheckBoxes, personalTagIdIsChecked: !tagCheckBoxes.personalTagIdIsChecked })} />
                </Grid>
                <Grid size={4}>
                    <RadioButton radioName="sortTasks" radioValue="ascName" radioLabel="Name A-Z" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "ascName"} />
                    <RadioButton radioName="sortTasks" radioValue="descName" radioLabel="Name Z-A" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "descName"} />
                    <RadioButton radioName="sortTasks" radioValue="ascDate" radioLabel="Oldest" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "ascDate"} />
                    <RadioButton radioName="sortTasks" radioValue="descDate" radioLabel="Most recent" handleOnchangeRadio={handleSortTasks} checked={selectedValue === "descDate"} />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {tasks.map((task: ITasks) => (
                    <TaskCard key={task.taskId} task={task} getTaskToEdit={getTaskToEdit} deleteTask={deleteTask} />
                ))}
            </Grid>
        </div>
    );
};

export default Tasks;
