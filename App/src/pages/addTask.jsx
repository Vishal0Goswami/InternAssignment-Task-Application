import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
    const navigate = useNavigate();
    const API_PATH = "https://internassignment-task-application-1.onrender.com";

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        user_id: null,
        status: false,
    });

    // -------------------------------------------------------
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await fetch(
                    `${API_PATH}/user/all-users`,
                    {
                        method:"GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );

                if (!usersResponse.ok) {
                    console.error(data.detail)
                    setError(data.error)
                    return;
                }

                const usersData = await usersResponse.json();
                
                setUsers(usersData);

            } catch (e) {
                console.error(e)
                setError(e.message);
                if(e.message == "You are unauthorized."){
                    navigate("/")
                }
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, []);

    //---------------------------------------------------------


    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "status" ? value === "true" : name === "user_id" ? value != "" ? Number(value) : value : value 
        }));
    };

    const sendData = async () => {
        try {
            setLoading(true);
            setError("");
    
            const response = await fetch(
                `${API_PATH}/tasks/create`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });


            const data = await response.json();

            if (!response.ok) {
                console.error(data.detail)
                setError(data.detail)
                return;
            }

            console.log("Task created:", data);

            // Go back to home after successful creation
            navigate("/home");

        } catch (error) {
            console.error(error);
            setError(error.message);
            if(error.message == "You are unauthorized."){
                navigate('/')
            }

        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")

        if (!formData.title.trim()) {
            setError("Please enter a task title.");
            return;
        }
        if (!formData.user_id) {
            setError("Please select User.");
            return;
        }


        sendData();
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-lg">

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Create New Task</h1>
                    <p className="text-slate-500 mt-2">Add a new task to your task list</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-7 border border-slate-200">
                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">
                        <p className="block text-sm font-semibold text-slate-700 mb-2">Task Title</p>
                        <input type="text" name="title" onChange={handleChange} placeholder="Enter task title" className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
                    </div>

                    <div className="mb-6">
                        <p className="block text-sm font-semibold text-slate-700 mb-2">Task Description</p>
                        <textarea name="description" onChange={handleChange} placeholder="Write task description..." rows="6" className="w-full resize-none border border-slate-300 rounded-lg px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
                    </div>

                    {fetching ? (
                        <div className="py-10 text-center text-slate-500">
                            Loading users and tasks...
                        </div>
                    ) : (
                        <>
                            {/* User */}
                            <div className="mb-5">
                                <p className="block text-sm font-semibold text-slate-700 mb-2">Select User</p>
                                <select name="user_id" value={formData.user_id} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                    <option value="">
                                        Select a user
                                    </option>

                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div> 

                            {/* Status */}
                            <div className="mb-7">
                                <p className="block text-sm font-semibold text-slate-700 mb-2">Task Status</p>

                                <select name="status" value={String(formData.status)} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                    <option value="false">
                                        Pending
                                    </option>

                                    <option value="true">
                                        Completed
                                    </option>
                                </select>
                            </div> 

                            {/* Buttons */}
                            <div className="flex gap-3">

                                <button type="button" onClick={() => navigate("/home")} disabled={loading} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-100 transition active:scale-95 disabled:opacity-50">
                                    Cancel
                                </button>

                                <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition active:scale-95 disabled:bg-green-400 disabled:cursor-not-allowed">
                                    {loading? "await...":"Create Task"}
                                </button>

                            </div>
                        </>
                    )} 
                 </form>

            </div>
        </div> 
    );
};

export default AddTask;

