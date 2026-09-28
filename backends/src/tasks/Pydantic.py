from pydantic import BaseModel 

class TaskValidate(BaseModel):
    title : str 
    description : str = "Empty" 
    user_id: int 
    status: bool = False 

class AssignValidate(BaseModel):
    user_id : int 


