import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RiGoogleFill } from "@remixicon/react";


const PageLogin = ()=>{
    const navigate = useNavigate();
    const API_PATH = "https://internassignment-task-application.onrender.com";

    
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleChange = (e) => {
        const {name, value} = e.target;
        
        setFormData((prev)=>({
            ...prev, 
            [name]: value,
        }));
    };


    const sendData = async () => {
        try{
            setLoading(true);
            setError("");
            
            const response = await fetch(
                `${API_PATH}/user/login`,
                {
                    method : "POST",
                    credentials: "include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(formData),
                }
            );

            const data = await response.json();
      
            if(!response.ok){
                console.error(data.detail)
                setError(data.detail)
                return;
            }

            // go back to home after successful creation
            navigate("/home");
        } catch(error){ 
            console.log(error)
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!formData.email.trim()){
            setError("please enter a email.")
            return;
        }

        if(!formData.password.trim()){
            setError("Please enter a valid password");
            return;
        }


        sendData();
    }
    
    const handleGoogleLogin = () => {
        try{
             setLoading(true)
             window.location.href = "https://internassignment-task-application.onrender.com/google/login";
        }catch(error){
            console.log(error)
        } finally{
            setLoading(false)
        }
    };

    return (
       <div className="min-h-screen bg-slate-100 flex  justify-center items-center px-4">
           <div className="w-full max-w-sm ">
                <div className="text-center mb-6 flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Login with </h1>
                    <p className="mt-3 p-2 bg-black rounded-full cursor-pointer disabled:cursor-not-allowed" disabled={loading} onClick={handleGoogleLogin}><RiGoogleFill size={32} color="red"/></p>
                
                    <p className="text-slate-500 mt-2">OR</p>
                </div>
                <form  onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-7 flex flex-col items-center gap-3">
                    {/* error */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="w-full flex flex-col gap-2">
                        <p>Email</p>
                        <input onChange={handleChange} className="border w-full p-2 text-sms rounded outline-none" type="email" placeholder="example@gmail.com" name="email"/>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <p>Password</p>
                        <input onChange={handleChange} className="border w-full p-2 text-sms rounded outline-none" type="password" placeholder="******" name="password"/>
                    </div>

                    <button type="submit" disabled={loading} className="border w-full p-1 bg-green-800 text-white rounded cursor-pointer active:scale-95 mt-5 disabled:scale-100 disabled:cursor-not-allowed"> {loading ? "wait..." : "Login"}</button>
                    <p>Don't have account <span className="text-blue-700 cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed" onClick={()=> navigate("/register")}>Register</span></p>
                </form>
           </div>
        </div>
    )
}

export default PageLogin