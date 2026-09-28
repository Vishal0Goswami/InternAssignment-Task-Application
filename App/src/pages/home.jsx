import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import TableData from "../components/Table";
import { useNavigate } from "react-router-dom";
import { API_PATH } from "../components/config";

const PageHome = ()=>{
    const navigate = useNavigate();


    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("")

    useEffect(function(){
        const getTask = async () =>{
            try{
                const response = await fetch(
                `${API_PATH}/tasks/get-task`,
                    {
                        method:'GET',
                        credentials: "include",
                        headers:{
                            "Content-Type":"application/json",
                        }
                    }
                );

                const data = await response.json();
                if(!response.ok){
                    throw new Error(data.detail || "Failed to fetch data")
                }
            
                setTasks(data);
        
            }catch(e){ 
                console.log(e.message)
                setError(e.message)
                if(e.message == "You are unauthorized."){
                    navigate('/')
                }
            }
        }

        getTask();
    },[])

    
    return (
        <div className="h-screen fixed w-full flex flex-col gap-5 items-center bg-gray-500 p-10">
            <SearchBar/>
            <TableData tasks={tasks} errors={error}/>
        </div>
    )
}

export default PageHome