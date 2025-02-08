import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';


function App() {

    return (
        <div style={{ marginTop: "2px" }} >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Tasks />} />
                    <Route path="/tasks/:id" element={<TaskDetails />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default App
