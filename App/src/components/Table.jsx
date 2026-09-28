import React, { useState } from "react"
import {useNavigate} from "react-router-dom"

const TableData = (props)=>{ 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)

    const TaskDone = async (e, idx) => {
            e.preventDefault();
            
            try {
                setLoading(true)
                const response = await fetch(
                    `https://internassignment-task-application.onrender.com/tasks/isDone/${idx}`,
                    {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type":"application/json",
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Failed to fetch task"
                    );
                }
            
                location.reload();
            } catch (error) {
                console.error(error);
                if(error.message == "You are unauthorized."){
                    navigate('/')
                }
            } finally{
                setLoading(false)
            }

            navigate("/home")
        };
    

    return (
        <div className="w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full min-w-[800px] text-left text-sm text-gray-600 ">

                    {/* Table Header */}
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">
                                S.No
                            </th>

                            <th className="px-6 py-4 font-semibold">
                                Title
                            </th>

                            <th className="px-6 py-4 font-semibold">
                                Description
                            </th>

                            <th className="px-6 py-4 font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 font-semibold">
                                Assigned User
                            </th>

                            <th className="px-6 py-4 text-center font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-100">
                        { props.errors ? 
                        (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center">
                                    <h1>Add Task</h1>
                                </td>
                            </tr>
                        ) : (
                          props.tasks.map((task, index) => (
        
                            <tr
                                key={task.id}
                                className="group transition duration-200 hover:bg-gray-50"
                            >

                                {/* S.No */}
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-500">
                                        {index + 1}
                                    </span>
                                </td>

                                {/* Title */}
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-gray-800">
                                        {task.title}
                                    </p>
                                </td>

                                {/* Description */}
                                <td className="max-w-sm px-6 py-4">
                                    <p className="truncate text-gray-500">
                                        {task.description || "Empty"}
                                    </p>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    {task.status ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                            Completed 
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                            Pending 
                                        </span>
                                    )}
                                </td>

                                {/* Assigned User */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                                            {task.user_name?.charAt(0).toUpperCase() || "U"}
                                            
                                        </div>

                                        <span className="font-medium text-gray-700">
                                            {task.user_name || "Not Assigned"}
                                        </span>

                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                          
                                        <button
                                            disabled={loading}
                                            onClick={ (e)=> {TaskDone(e, task.id)} }
                                            className={`relative h-6 w-11 rounded-full transition cursor-pointer active:bg-red-200 disabled:cursor-not-allowed ${
                                                task.status ? "bg-green-500" : "bg-gray-300"
                                            }`}>
                                            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${task.status ? "left-6" : "left-1" }`}/>
                                        </button>
                                    </div>
                                </td>

                            </tr>

                        ))
                     )}
                    </tbody>
                </table>
         </div>
    )
}

export default TableData