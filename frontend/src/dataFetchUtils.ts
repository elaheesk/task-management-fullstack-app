import axios from "axios";

export const getData = async (searchTerm: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/tasks?taskName=${searchTerm}`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

export const getTask = async (id: number) => {
    const url = `http://localhost:5000/tasks/${id}`;
    const response = await axios.get(url);
    return response.data;

}

export const getTaskToDelete = async (id: number) => {
    const url = `http://localhost:5000/tasks/${id}`;
    const response = await axios.delete(url);
    return response;

}
export const postOrEditTasks = async (data:any,fetchMethod:string) => {
    const response = await fetch('http://localhost:5000/tasks', {
        method: fetchMethod,
        body: data
    })
    return response;
}


