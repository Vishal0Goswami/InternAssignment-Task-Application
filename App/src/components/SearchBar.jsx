import React from "react"
import { useNavigate } from "react-router-dom"
import { API_PATH } from "./config";

const SearchBar = ()=>{
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try{
            const response = await fetch(`${API_PATH}/user/logout`, {
                method: "POST",
                credentials: "include"
            });
     
            if(response.ok){
               navigate("/");
            }
        } catch(error){
            console.error(error)
        }
     
    };
    return (
        <div className="w-full h-20 border flex justify-between p-5 bg-white">
            <form className="h-9 w-[60%] flex gap-4">
                <input
                    className="border h-full w-full px-2 py-1 rounded"
                    type="search"
                    placeholder="Search task by title..."
                />

                <select className="border h-full px-2 py-1 rounded">
                    <option value="">Status</option>
                    <option value="true">Completed</option>
                    <option value="false">Pending</option>
                </select>

                <select className="border h-full px-2 py-1 rounded">
                    <option value="">Assign User</option>
                    <option value="1">Karan</option>
                    <option value="2">Rahul</option>
                </select>

                <button
                    type="submit"
                    className="bg-amber-400 px-5 py-1 text-white cursor-pointer active:scale-95 rounded"
                >
                    Search
                </button>
            </form>
            <div className="flex gap-1">
                <button onClick={()=>{ navigate("/Add-Task") }} className="bg-green-700 px-5 py-1 text-white cursor-pointer active:scale-95 rounded">Add Task</button>
                <button onClick={handleLogout} className="bg-pink-500 px-5 py-1 text-white cursor-pointer active:scale-95 rounded">SignOut</button>
            </div>
        </div>
    )
}

export default SearchBar 