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
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);
  const [editableTasks, setEditableTasks] = useState(null);

  // update view data (call this whenever data changes)
  const updateView = async () => {
    await loadList(id);
    
  };

  // load the list from server
  const loadList = async (id) => {
    const res = await Axios.get(`/lists/${id}`);
    setList(res.data);
    setLoading(false);
  };

  // update task status (done || not done) to server
  const toggleDone = async (task, i) => {
    task.done = !task.done;
    const res = await Axios.post(`/lists/${id}/${i}`, { task: task });
    updateView();
    // TODO add trycatch to show a toast notification
  };

  // toggles the form to add a new task
  const toggleAddTaskForm = () => {
    setAddTaskFormVisible(!addTaskFormVisible);
    setTimeout(() => {
      if (!addTaskFormVisible) document.getElementById("new-task-name").focus();
    }, 300);
  };

  // submit the new task to be added
  const addTaskFormSubmit = async (e) => {
    e.preventDefault();
    const res = await Axios.post(`/lists/${id}/add`, { task: newTask });
    // reset the form
    toggleAddTaskForm();
    setNewTask({ name: "" });
    updateView();
  };

  // update task form data
  const handleChange = (e, i) => {
    let updatedTasks = [...editableTasks];
    let updatedTask = { ...updatedTasks[i], [e.target.name]: e.target.value };
    updatedTasks[i] = updatedTask;
    setEditableTasks(updatedTasks);
  };

  const updateTaskFormSubmit = async (e) => {
    const res = await Axios.post(`/lists/${id}/${selectedTaskIndex}`, { task: editableTasks[selectedTaskIndex] });
    updateView();
  };

  const showDatePicker = () => {};

  // load the list when: the component mounts and when the data is modified
  useEffect(() => {
    loadList(id);
  }, [id]);

  useEffect(() => {
    setEditableTasks(list.tasks);
  }, [list.tasks]);

  useEffect(() => {
    if (editableTasks === null || editableTasks === undefined) setEditableTasks(list.tasks);
  }, [list]);

  useEffect(() => {
    // console.log(selectedTask);
  }, [selectedTaskIndex]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="border border-2 border-dark m-2">
          <div className="d-flex flex-row">
            <div
              className={`p-3 flex-grow-1 text-left ${selectedTaskIndex > -1 ? "clickable" : ""}`}
              onClick={() => {
                selectedTaskIndex > -1 && setSelectedTaskIndex(-1);
              }}>
              <div className="small-bold">{selectedTaskIndex > -1 && "RETURN TO "}LIST</div>
              {list.name}
            </div>
            {selectedTaskIndex > -1 ? (
              <div className="p-2 border-left border-2 border-dark clickable small-bold" onClick={(e) => updateTaskFormSubmit(e)}>
                SAVE
                <br />
                CHANGES
              </div>
            ) : (
              <div className="d-flex flex-column border-left border-2 border-dark">
                <div className={`flex-grow-1 p-2 clickable w-100 small-bold`}>RENAME</div>
                <div
                  className={`flex-grow-1 p-2 border-top border-2 border-dark clickable w-100 small-bold 
                ${doneTasksVisible ? "hide" : "show"}-done`}
                  onClick={() => setDoneTasksVisible(!doneTasksVisible)}
                />
              </div>
            )}
          </div>
          <div className="d-flex flex-row bg-dark text-white-50 border-top border-2 border-dark small-bold">
            <div className="p-2 flex-72">DONE?</div>
            <div className="border-left border-2 border-dark p-2 flex-grow-1">TASK</div>
            <div className="border-left border-2 border-dark p-2 flex-72">DATE</div>
            <div className="border-left border-2 border-dark p-2 flex-72">CO.</div>
          </div>
          {list.tasks.map((task, i) => (
            <div
              className={`task-row d-flex flex-row  ${i > 0 ? " border-top border-2 border-dark" : ""} ${task.done ? " text-muted" : ""} ${
                (i !== selectedTaskIndex && selectedTaskIndex !== -1) || (task.done && !doneTasksVisible) ? " collapsed" : ""
              } ${i === selectedTaskIndex ? "expanded" : ""}`}
              key={i}>
              {/* <form> */}
              <div
                className={`clickable flex-72 done-btn-${task.done ? "yes" : "no"} ${
                  i === selectedTaskIndex ? "border-bottom border-2 border-dark task-row" : "border-0"
                }`}
                onClick={() => toggleDone(task, i)}
              />
              <div
                className={`border-left border-2 border-dark flex-grow-1 ${i === selectedTaskIndex ? "" : "editable overflow-hidden"}`}
                onClick={() => setSelectedTaskIndex(i)}>
                {i === selectedTaskIndex ? (
                  <Fragment>
                    <input
                      type="text"
                      name="name"
                      placeholder="What is the task?"
                      className={`border-0 w-100 text-body px-2 pt-2 pb-1 ${i === selectedTaskIndex ? "editable p-2" : ""}`}
                      value={editableTasks[i].name}
                      onChange={(e) => handleChange(e, i)}
                    />
                    <textarea
                      name="description"
                      value={editableTasks[i].description}
                      onChange={(e) => handleChange(e, i)}
                      placeholder="(no description)"
                      style={{ height: "calc( 100% - 44px )" }}
                      className={`${
                        i === selectedTaskIndex ? "p-2" : "px-2 py-1"
                      } w-100 small-bold editable text-body border-top border-2 border-dark overflow-auto`}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className={`text-truncate px-2 pt-2 pb-1 ${i === selectedTaskIndex ? "editable p-2" : ""}`}>{task.name}</div>
                    <div className={`small-bold text-truncate ${i === selectedTaskIndex ? "p-2" : "px-2 py-1"}`}>{task.description}</div>
                  </Fragment>
                )}
              </div>
              <div
                className={`border-left border-2 border-dark flex-72 small-bold`}
                onClick={() => setSelectedTaskIndex(i) && showDatePicker()}>
                <div className={`p-2 editable task-row ${i === selectedTaskIndex ? "border-bottom border-2 border-dark" : ""}`}>
                  {task.date !== undefined ? formatDate(task.date) : "-"}
                </div>
                {/* TODO amount of time left */}
              </div>
              <div className="border-left border-2 border-dark p-2 flex-72">...</div>
              {/* </form> */}
            </div>
          ))}
          {selectedTaskIndex === -1 && (
            <div className="task-row d-flex flex-row border-top border-2 border-dark">
              <div className={`clickable w-100 px-3 ${addTaskFormVisible ? "flex-72" : "text-left"}`} onClick={() => toggleAddTaskForm()}>
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
                      className={`p-3 border-0 w-100 h-100 bg-white-50 text-body ${addTaskFormVisible ? "flex-72" : "text-left"}`}
                    />
                  </div>
                </form>
              ) : (
                <Fragment />
              )}
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default List;
