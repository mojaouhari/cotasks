import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { formatDate } from "../utils";
import Loading from "./Loading";

const List = ({
  match: {
    params: { id },
  },
}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [addTaskFormVisible, setAddTaskFormVisible] = useState(false);
  const [newTask, setNewTask] = useState({ name: "" });
  const [doneTasksVisible, setDoneTasksVisible] = useState(true);

  // load the list from server
  const loadList = async (id) => {
    const res = await Axios.get(`/lists/${id}`);
    setList(res.data);
    setLoading(false);
  };

  // update task status (done || not done) to server
  const toggleDone = async (task, i) => {
    task.done = !task.done;
    const res = await Axios.post(`/lists/${id}/${i}`, { task });
    // TODO add trycatch to show a toast notification
  };

  const toggleAddTaskForm = () => {
    setAddTaskFormVisible(!addTaskFormVisible);
    setTimeout(() => {
      if (!addTaskFormVisible) document.getElementById("new-task-name").focus();
    }, 300);
  };

  const addTaskFormSubmit = async (e) => {
    e.preventDefault();
    const res = await Axios.post(`/lists/${id}/add`, { task: newTask });
    toggleAddTaskForm();
    setNewTask({ name: "" });
  };

  // on component mount
  useEffect(() => {
    loadList(id);
  }, [id, toggleDone, addTaskFormSubmit]);

  useEffect(() => {
    // console.log(list);
  }, [list]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="border border-2 border-dark m-2">
          <div className="d-flex flex-row">
            <div className="p-3 flex-grow-1">{list.name}</div>
            <div className="flex-column border-left border-2 border-dark">
              <div className={`p-2 clickable w-100 bg-white-50 small-bold`}>RENAME</div>
              <div
                className={`p-2 border-top border-2 border-dark clickable w-100 bg-white-50 small-bold ${
                  doneTasksVisible ? "hide" : "show"
                }-done`}
                onClick={() => setDoneTasksVisible(!doneTasksVisible)}
              />
            </div>
          </div>
          <div className="d-flex flex-row bg-dark text-white-50 border-top border-2 border-dark small-bold">
            <div className="p-2 flex-72">DONE?</div>
            <div className="border-left border-2 border-dark p-2 flex-grow-1">TASK</div>
            <div className="border-left border-2 border-dark p-2 flex-72">DATE</div>
            <div className="border-left border-2 border-dark p-2 flex-192">COLLABORATORS</div>
          </div>
          {list.tasks.map((task, i) => (
            <div key={i} id={`toz-${i}`}>
              {(!task.done || doneTasksVisible) && (
                <div className={`task-row d-flex flex-row border-top border-2 border-dark ${task.done ? "text-muted" : ""}`}>
                  <div
                    className={`clickable flex-72 bg-white-50 border-0 done-btn-${task.done ? "yes" : "no"}`}
                    onClick={() => toggleDone(task, i)}
                  />
                  <div className="border-left border-2 border-dark p-2 flex-grow-1">{task.name}</div>
                  <div className="border-left border-2 border-dark p-2 flex-72 small-bold">
                    {task.date !== undefined ? formatDate(task.date) : "-"}
                  </div>
                  <div className="border-left border-2 border-dark p-2 flex-192">...</div>
                </div>
              )}
            </div>
          ))}
          <div className="task-row d-flex flex-row border-top border-2 border-dark">
            <div
              className={`clickable px-3 border-0 w-100 bg-white-50 ${addTaskFormVisible ? "flex-72" : "text-left"}`}
              onClick={() => toggleAddTaskForm()}>
              {addTaskFormVisible ? "X" : "ADD A TASK"}
            </div>
            {addTaskFormVisible ? (
              <form className="d-flex flex-grow-1" onSubmit={(e) => addTaskFormSubmit(e)}>
                <div className="border-left border-2 border-dark flex-grow-1">
                  <input
                    type="text"
                    className="border-0 text-body bg-white-50 w-100 h-100 p-2"
                    placeholder="What is the task?"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ name: e.target.value })}
                    id="new-task-name"
                  />
                </div>
                <div className="border-left border-2 border-dark ">
                  <input
                    type="submit"
                    value="ADD"
                    className={`p-3 border-0 w-100 h-100 bg-white-50 ${addTaskFormVisible ? "flex-72" : "text-left"}`}
                  />
                </div>
              </form>
            ) : (
              <Fragment />
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default List;
