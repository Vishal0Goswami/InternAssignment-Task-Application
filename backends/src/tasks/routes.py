from fastapi import APIRouter, Depends, status, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from src.tasks.Pydantic import TaskValidate, AssignValidate
from src.utils.db import get_db
from src.users.routes import Auth, User
from src.tasks.models import Task
from src.utils.mail import sendEmailToUser


task_app = APIRouter(prefix="/tasks")


# #-----------------------------get Users Table-------------------
# @task_app.patch("/update-User/{task_id}")
# def getUserTask(task_id:int, body:UpdateUserValidate ,db:Session = Depends(get_db), user:Register = Depends(Auth)):
#     userTask = db.query(UserTask).filter(UserTask.task_id == task_id).first();
#     if not userTask:
#         return HTTPException(404, detail="incorrect ID")

#     userTask.user_id = body.user_id;

#     db.add(userTask)
#     db.commit()
#     db.refresh(userTask)
#     return userTask

#-----------------------------Get Task------------------------------
@task_app.get("/get-task")
def getTask(task_id:int=None, db: Session = Depends(get_db), user: User = Depends(Auth)):
    if task_id:
        task = db.query(Task).filter(Task.id == task_id).first();
        if not task:
            raise HTTPException(404, detail="ID not exists")
        temp = {
            "id":task.id,
            "title":task.title,
            "description":task.description, 
            "user_id":task.user_id,
            "status":task.status,
            "user_name":task.user_rel.name
        }
        return task 
    
    allTask = []
    tasks = db.query(Task).all();
    for task in tasks:
        temp = {
            "id":task.id,
            "title":task.title,
            "description":task.description, 
            "user_id":task.user_id,
            "status":task.status,
            "user_name":task.user_rel.name
        }
        allTask.append(temp)
    allTask.sort(key=lambda x: x["status"])
    return allTask

#-----------------------------Create Task----------------------------
@task_app.post("/create")
def addTask(body:TaskValidate, bg_task:BackgroundTasks, db:Session = Depends(get_db), user:User = Depends(Auth)):
    new_task = Task(
        title = body.title,
        description = body.description,
        status = body.status,
        user_id = body.user_id 
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    html = "<h1>Your Task, Successfully Created!</h1>"
    subject = "Confirmation"
    bg_task.add_task(sendEmailToUser,user.email, html, subject)

    return new_task 


#-------------------------Update Task User------------------------------
@task_app.patch("/update-task-user/{task_id}")
def AssignTask(task_id:int, body:AssignValidate, db:Session = Depends(get_db), user:User = Depends(Auth)):
    task = db.query(Task).filter(Task.id == task_id).first();
    if not task:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task ID incorrect")
    task.user_id = body.user_id 

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


#-----------------------------Is Task Done-------------------------------
@task_app.patch("/isDone/{task_id}")
def IsDone(task_id:int,  bg_task:BackgroundTasks, db:Session = Depends(get_db), user:User = Depends(Auth)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task ID incorrect")

    if(task.status == True):
        task.status = False;
    else:
        task.status = True;

    db.add(task)
    db.commit()
    db.refresh(task)
    if task.status == True:
        html = "<h1>Congratulation to Successfuly completed Task</h1>"
        subject = "Task Done"
        bg_task.add_task(sendEmailToUser, task.user_rel.email, html, subject);
    
    return "Successfuly Update"

