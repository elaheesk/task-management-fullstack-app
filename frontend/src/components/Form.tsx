import { Input, InputLabel, Button, FormLabel, FormControl, RadioGroup } from '@mui/material';
import SendIcon from '@mui/material/Icon';
import RadioButton from './RadioButton';
import React, { useRef } from 'react';

const Form = ({ handleOnChange, inputVal, handleSubmit, newFile, setNewFile, existingFile, setExistingFile, errorMessages }: any) => {
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
    return (
        <form encType='multipart/form-data' style={{ border: "1px solid gray", borderRadius: "15px", paddingLeft: "20px", paddingBottom: "20px", paddingTop: "10px", textAlign: "start" }} onSubmit={handleSubmit} >
            <FormControl>
                <RadioGroup row>
                    <RadioButton radioName="tagId" radioValue="1" radioLabel="work" handleOnchangeRadio={handleOnChange} checked={inputVal.tagId === "1"} />
                    <RadioButton radioName="tagId" radioValue="2" radioLabel="personal" handleOnchangeRadio={handleOnChange} checked={inputVal.tagId === "2"} />
                </RadioGroup>
                {errorMessages.tagIdError ? <p style={{ color: "red" }}>{errorMessages.tagIdError}</p> : null}
            </FormControl>
            <InputLabel>Task</InputLabel>
            <Input type="text" value={inputVal.name} name="name" onChange={handleOnChange} />
            <p style={{ color: "red" }}>{errorMessages.nameError}</p>
            <InputLabel>Date</InputLabel>
            <Input size="medium" type="date" value={inputVal?.date} name="date" onChange={handleOnChange} />
            <p style={{ color: "red" }}>{errorMessages.dateError}</p>
            <FormControl>
                <FormLabel sx={{ marginTop: "25px" }}>Rank</FormLabel>
                <RadioButton radioName="ranktask" radioValue="1" radioLabel="Very important" handleOnchangeRadio={handleOnChange} checked={inputVal.ranktask === "1"} />
                <RadioButton radioName="ranktask" radioValue="2" radioLabel="Important" handleOnchangeRadio={handleOnChange} checked={inputVal.ranktask === "2"} />
                <RadioButton radioName="ranktask" radioValue="3" radioLabel="Can wait" handleOnchangeRadio={handleOnChange} checked={inputVal.ranktask === "3"} />
                <p style={{ color: "red" }}>{errorMessages.ranktaskError}</p>
            </FormControl>
            <div style={{ marginBottom: "10px" }}>
                {existingFile ? (
                    <div>
                        <p>Current File: {existingFile.name}</p>
                        <Button type="button" onClick={() => setExistingFile(null)}>Remove File</Button>
                    </div>
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
                            <div>
                                <p>Uploaded File: {newFile.name}</p>
                                <p>Type: {newFile.type}</p>
                                <p>Size: {(newFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div>
                <Button type="submit" variant="contained" size="small" endIcon={<SendIcon />}>
                    {inputVal.id ? "Update Task" : "Create task"}
                </Button>
            </div>
        </form>
    )
}
export default Form