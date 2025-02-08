import { Input, InputLabel, Button, FormLabel, FormControl, RadioGroup } from '@mui/material';
import SendIcon from '@mui/material/Icon';
import RadioButton from './RadioButton';
import React, { useEffect, useRef } from 'react';

const Form = ({ status, blurHandler, handleOnChange, inputVal, handleSubmit, newFile, setNewFile, existingFile, setExistingFile }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setNewFile(selectedFile);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }
    useEffect(() => {

    }, [])
    console.log(inputVal)
    return (
        <form encType='multipart/form-data' style={{ border: "1px solid gray", borderRadius: "15px", paddingLeft: "20px", paddingBottom: "20px", paddingTop: "10px", textAlign: "start" }} onSubmit={handleSubmit} >
            <FormControl>
                <RadioGroup row>
                    <RadioButton radioName="tagId" radioValue="1" radioLabel="work" handleOnchangeRadio={blurHandler} checked={inputVal.tagId.value === "1"} />
                    <RadioButton radioName="tagId" radioValue="2" radioLabel="personal" handleOnchangeRadio={blurHandler} checked={inputVal.tagId.value === "2"} />
                </RadioGroup>
                {inputVal?.tagId.hasError && <div style={{ color: "red" }}>{inputVal?.tagId.errorMessage}</div>}
            </FormControl>
            <FormControl>
                <InputLabel>Task</InputLabel>
                <Input type="text" value={inputVal.name.value} name="name" onChange={handleOnChange} onBlur={blurHandler} />
                {inputVal?.name.touched && inputVal?.name.hasError && <div style={{ color: "red" }}>{inputVal?.name.errorMessage}</div>}
            </FormControl>

            <InputLabel>Date</InputLabel>
            <Input size="medium" type="date" value={inputVal?.date.value} name="date" onChange={handleOnChange} onBlur={blurHandler} />
            {inputVal?.date.hasError && <div style={{ color: "red" }}>{inputVal?.date.errorMessage}</div>}
            <RadioGroup>
                <FormLabel sx={{ marginTop: "25px" }}>Rank  </FormLabel>
                <RadioButton radioName="ranktask" radioValue="1" radioLabel="Very important" handleOnchangeRadio={handleOnChange} checked={inputVal.ranktask.value === "1"} />
                <RadioButton radioName="ranktask" radioValue="2" radioLabel="Important" handleOnchangeRadio={handleOnChange} checked={inputVal.ranktask.value === "2"} />
                <RadioButton radioName="ranktask" radioValue="3" radioLabel="Can wait" handleOnchangeRadio={handleOnChange} checked={inputVal.ranktask.value === "3"} />
                {!inputVal?.ranktask.touched && inputVal?.ranktask.hasError && <div style={{ color: "red" ,marginBottom:"10px"}}>{inputVal?.ranktask.errorMessage}</div>}
            </RadioGroup>
            <div style={{ marginBottom: "10px" }}>
                {existingFile ? (
                    <section>
                        <p>Current File: {existingFile.name}</p>
                        <Button type="button" onClick={() => setExistingFile(null)}>Remove File</Button>
                    </section>
                ) : (
                    <>
                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            size="small"
                        >
                            Upload file
                            <input
                                ref={fileInputRef} type="file" name="file" onChange={handleNewFileUpload} style={{ display: "none" }}
                            />
                        </Button>
                        {newFile && (
                                <section>
                                    <p>Uploaded File: {newFile.name}</p>
                                <p>Type: {newFile.type}</p>
                                <p>Size: {(newFile.size / 1024).toFixed(2)} KB</p>
                            </section>
                        )}
                    </>
                )}
            </div>
            <div>
                <Button type="submit" variant="contained" size="small" endIcon={<SendIcon />}>
                    {inputVal.id.value ? "Update Task" : "Create task"}
                </Button>
            </div>
            {status && <div style={{ color: "red", marginTop: "5px" }}>{status}</div>}
        </form>
    )
}
export default Form