import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_PATH } from "../components/config";

const PageRegister = ()=>{
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
        re_password:"",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>{
        const {name, value} = e.target 

        setFormData((prev)=>({
            ...prev, 
            [name] : value
        }));
    }

    const sendData = async () =>{

        try{
           setLoading(true);
           setError("");

           const response = await fetch(
            `${API_PATH}/user/register`,
            {
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({ 
                    name: formData.name, 
                    email: formData.email, 
                    password: formData.password, 
                }),
            });

           const data = await response.json(); 

           if(!response.ok){
             console.error(data.detail)
             setError(data.detail)
             return;
           }
           console.log("Registration successful:");

           navigate("/");
        }catch(error){
           console.error("Registration error:", error); 
           setError(error.message);
        }finally{
            setLoading(false);
        }
    };

    const handleSubmit = (e) =>{
         e.preventDefault();
        
         setError("");
         if ( !formData.name.trim() || !formData.email.trim() || !formData.password || !formData.re_password ) { setError("Please fill all fields."); return; }

         if(formData.password.trim() != formData.re_password.trim()){
            setError("Password didn't match");
            return;
         }
         
         sendData();
    }
    return (
        <div className="min-h-screen bg-slate-100 flex  justify-center items-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Registration</h1>
                    <p className="text-slate-500 mt-2">register for further Process</p>
                </div>

                <form  onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-7 flex flex-col items-center gap-5">
                    {error &&(
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="w-full flex flex-col gap-2">
                        <p>Name</p>
                        <input onChange={handleChange}  className="border w-full p-2 text-sms rounded outline-none" type="text" placeholder="example:karan" name="name"/>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <p>Email</p>
                        <input onChange={handleChange} className="border w-full p-2 text-sms rounded outline-none" type="email" placeholder="example@gmail.com" name="email"/>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <p>Password</p>
                        <input onChange={handleChange} className="border w-full p-2 text-sms rounded outline-none" type="password" placeholder="******" name="password"/>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <p>Re-Password</p>
                        <input onChange={handleChange} className="border w-full p-2 text-sms rounded outline-none" type="password" placeholder="******" name="re_password"/>
                    </div>
                    <button disabled={loading} className="border w-full p-1 bg-green-800 text-white rounded cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:scale-100">{loading? "wait..." : "Register"}</button>
                    <p>Already have account <span className="text-blue-700 cursor-pointer" onClick={()=> navigate("/")}>Login</span></p>
                </form>
           </div>
        </div>
    )
}

export default PageRegister