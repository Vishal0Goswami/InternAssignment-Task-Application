from pydantic import BaseModel 


class registerValidate(BaseModel):
    name : str 
    email : str 
    password : str 


class loginValidate(BaseModel):
    email : str 
    password : str 


#---------------------Responses---------------
class UserResponse(BaseModel):
    id: int 
    name : str 
    email : str 