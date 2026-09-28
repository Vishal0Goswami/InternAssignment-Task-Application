import React from "react"
import { Routes, Route } from "react-router-dom";
import PageLogin from "./pages/login"
import AddTask from "./pages/addTask";
import PageHome from "./pages/home";
import PageRegister from "./pages/register";


const App = () =>{
    return (
        <Routes>
            <Route path="/" element={<PageLogin />} />
            <Route path="/home" element={<PageHome /> } />
            <Route path="/register" element={<PageRegister />} />
            <Route path="/Add-Task" element={<AddTask />} />
        </Routes>
    )
}

export default App 