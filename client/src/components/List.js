import React, { useEffect, useState, Fragment, createRef } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { formatDate } from "../utils";
import Loading from "./Loading";
import Autocomplete from "./Autocomplete";

const taskNameInput = createRef();
const taskDescriptionInput = createRef();

const List = ({
  match: {
    params: { id },
  },
  user,
}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [addTaskFormVisible, setAddTaskFormVisible] = useState(false);
  const [newTask, setNewTask] = useState({ name: "" });
  const [doneTasksVisible, setDoneTasksVisible] = useState(true);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);
  const initalEditableTask = {
    done: null,
    name: "",
    description: "",
    date: null,
    collaborators: [],
  };
  const [editableTask, setEditableTask] = useState(initalEditableTask);
  const [editableTaskDate, setEditableTaskDate] = useState({
    year: "",
    month: "",
    day: "",
    // time: "--:--",
  });
  const [listName, setListName] = useState("");
  const [collaboratorSearchField, setCollaboratorSearchField] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [tooltipUserID, setTooltipUserID] = useState("");

  // update view data (call this whenever data changes)
  const updateView = async () => {
    await loadList(id);
  };

  // load the list from server
  const loadList = async (id) => {
    const res = await Axios.get(`/api/lists/${id}`);
    setList(res.data);
    setLoading(false);
  };

  // update task status (done || not done) to server
  const toggleDone = async (task, i) => {
    task.done = !task.done;
    const res = await Axios.post(`/api/lists/${id}/${i}`, { task: task });
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
    const res = await Axios.post(`/api/lists/${id}/add`, { task: newTask });
    // reset the form
    toggleAddTaskForm();
    setNewTask({ name: "" });
    updateView();
  };

  // update task form data
  const handleChange = (e) => {
    const updatedTask = { ...editableTask, [e.target.name]: e.target.value };
    setEditableTask(updatedTask);
  };
  const handleAddCollaborator = (e) => {
    // checking for duplicates
    if (editableTask.collaborators.some((collaborator) => collaborator._id !== e.target.value._id)) {
      // TODO show toast alert that you're adding a duplicate
    } else {
      const updatedTask = { ...editableTask, collaborators: [...editableTask.collaborators, e.target.value] };
      setEditableTask(updatedTask);
    }
  };
  const handleRemoveCollaborator = (e, j) => {
    let updatedCollaborators = editableTask.collaborators;
    updatedCollaborators.splice(j, 1);
    const updatedTask = { ...editableTask, collaborators: updatedCollaborators };
    setEditableTask(updatedTask);
  };
  const handleDateChange = (e) => {
    setEditableTaskDate({ ...editableTaskDate, [e.target.name]: e.target.value });
  };

  const updateTaskFormSubmit = async (e) => {
    const res = await Axios.post(`/api/lists/${id}/${selectedTaskIndex}`, { task: editableTask });
    updateView();
  };

  const renameList = async () => {
    if (list.name !== listName) await Axios.post(`/api/lists/${id}/rename`, { name: listName });
  };

  const loadAllUsers = async () => {
    const res = await Axios.get("/api/users");
    setAllUsers(res.data);
  };

  const loadAllUsersOnce = () => {
    if (!allUsers.length) loadAllUsers();
    return true;
  };

  // load the list when: the component mounts and when the data is modified
  useEffect(() => {
    loadList(id);
  }, [id]);

  useEffect(() => {
    setListName(list.name);
  }, [list.name]);

  useEffect(() => {
    if (selectedTaskIndex > -1) {
      setEditableTask({ ...list.tasks[selectedTaskIndex] });
      if (list.tasks[selectedTaskIndex].date) {
        const date = new Date(list.tasks[selectedTaskIndex].date);
        setEditableTaskDate({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
      } else {
        setEditableTaskDate({ year: "", month: "", day: "" });
      }
    } else {
      setEditableTask(initalEditableTask);
    }
  }, [selectedTaskIndex, list.tasks]);

  useEffect(() => {
    if (editableTaskDate.day || editableTaskDate.month || editableTaskDate.year) {
      const date = new Date(editableTaskDate.year, editableTaskDate.month - 1, editableTaskDate.day);
      setEditableTask({ ...editableTask, date: date.toJSON() });
    }
  }, [editableTaskDate]);

  useEffect(() => {
    loadAllUsersOnce();
  }, [collaboratorSearchField, tooltipUserID]);

  return (
    <Fragment>
      {loading ? (
        <Loading isFullScreen={true} />
      ) : (
        (list.creator === user._id || list.tasks.some((task) => task.collaborators.some((collaborator) => collaborator._id === user._id))) && (
          <div className="border border-2 border-dark m-2">
            <div className="d-flex flex-row">
              <div
                className={`p-3 flex-grow-1 text-left ${selectedTaskIndex > -1 ? "clickable" : list.creator === user._id && "editable"}`}
                onClick={() => {
                  selectedTaskIndex > -1 || list.creator !== user._id
                    ? setSelectedTaskIndex(-1)
                    : document.getElementById("rename-list").focus();
                }}>
                <div className="small-bold">
                  {selectedTaskIndex > -1 && "RETURN TO "}LIST
                  {selectedTaskIndex > -1 && editableTask !== list.tasks[selectedTaskIndex] && " WHITHOUT SAVING"}
                </div>
                {selectedTaskIndex > -1 || list.creator !== user._id ? (
                  <div style={{ padding: "1px 0" }}>{list.name}</div>
                ) : (
                  <input
                    type="text"
                    id="rename-list"
                    className={`border-0 w-100 text-body`}
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    onBlur={() => renameList()}
                  />
                )}
              </div>
              {selectedTaskIndex > -1 ? (
                <div
                  className="border-left border-2 border-dark flex-72"
                  onClick={(e) => editableTask !== list.tasks[selectedTaskIndex] && updateTaskFormSubmit(e)}>
                  <div
                    className={`p-2 h-100 small-bold d-flex align-items-center justify-content-center ${
                      editableTask !== list.tasks[selectedTaskIndex] ? "clickable" : "text-muted"
                    }`}>
                    SAVE
                  </div>
                </div>
              ) : (
                <div className="border-left border-2 border-dark flex-72">
                  <div
                    className={`p-2 clickable h-100 small-bold d-flex align-items-center justify-content-center`}
                    onClick={() => setDoneTasksVisible(!doneTasksVisible)}>
                    <div className={`${doneTasksVisible ? "hide" : "show"}-done`} />
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex flex-row bg-dark text-white-50 border-top border-2 border-dark small-bold">
              <div className="p-2 flex-72">DONE?</div>
              <div className="border-left border-2 border-dark p-2 flex-grow-1">TASK</div>
              <div className="border-left border-2 border-dark p-2 flex-72">DATE</div>
              <div className="border-left border-2 border-dark p-2 flex-72">CO.</div>
            </div>
            {list.tasks !== undefined &&
              list.tasks.map(
                (task, i) =>
                  (list.creator === user._id || task.collaborators.some((collaborator) => collaborator._id === user._id)) && (
                    <div
                      className={`task-row content-box overflow-hidden d-flex flex-row  ${i > 0 ? " border-top border-2 border-dark" : ""} ${
                        task.done ? " text-muted" : ""
                      } ${(i !== selectedTaskIndex && selectedTaskIndex !== -1) || (task.done && !doneTasksVisible) ? " collapsed" : ""} ${
                        i === selectedTaskIndex ? "expanded" : ""
                      }`}
                      key={i}>
                      <div
                        className={`clickable flex-72 done-btn-${task.done ? "yes" : "no"} ${
                          i === selectedTaskIndex ? "border-bottom border-2 border-dark task-row" : "border-0"
                        }`}
                        onClick={() => toggleDone(task, i)}
                      />
                      <div
                        className={`border-left border-2 border-dark flex-grow-1 ${i === selectedTaskIndex ? "" : "editable"}`}
                        style={{ overflow: "hidden" }}>
                        {i === selectedTaskIndex ? (
                          <Fragment>
                            <input
                              type="text"
                              ref={taskNameInput}
                              name="name"
                              placeholder="What is the task?"
                              style={{ paddingTop: "0.7rem" }}
                              className={`border-0 w-100 text-body px-2 ${i === selectedTaskIndex ? "editable pb-2" : ""}`}
                              value={editableTask.name}
                              onChange={(e) => handleChange(e)}
                            />
                            <textarea
                              name="description"
                              ref={taskDescriptionInput}
                              value={editableTask.description}
                              onChange={(e) => handleChange(e)}
                              placeholder="(no description)"
                              style={{ height: "calc( 100% - 48px )", resize: "none" }}
                              className={`${
                                i === selectedTaskIndex ? "p-2" : "px-2 py-1"
                              } w-100 small-bold editable text-body border-top border-2 border-dark overflow-auto`}
                            />
                          </Fragment>
                        ) : (
                          <Fragment>
                            <div
                              onClick={() => {
                                setSelectedTaskIndex(i);
                                setTimeout(() => {
                                  taskNameInput.current.focus();
                                }, 200);
                              }}
                              style={{ paddingTop: "0.7rem" }}
                              className={`text-truncate px-2 ${i === selectedTaskIndex ? "editable pb-2" : ""}`}>
                              {task.name}
                            </div>
                            <div
                              onClick={() => {
                                setSelectedTaskIndex(i);
                                setTimeout(() => {
                                  taskDescriptionInput.current.focus();
                                }, 200);
                              }}
                              style={{ paddingBottom: "0.7rem" }}
                              className={`small-bold text-truncate ${i === selectedTaskIndex ? "p-2" : "px-2 pt-1"}`}>
                              {task.description}
                            </div>
                          </Fragment>
                        )}
                      </div>
                      <div className={`border-left border-2 border-dark flex-72 small-bold`} onClick={() => setSelectedTaskIndex(i)}>
                        <div className={`editable ${i === selectedTaskIndex ? "border-bottom border-2 border-dark" : "p-2 task-row"}`}>
                          {i === selectedTaskIndex ? (
                            <>
                              <div>
                                <input
                                  type="number"
                                  placeholder="Year"
                                  min="1970"
                                  max="3000"
                                  className="w-100 px-1 py-2 font-weight-bold text-body"
                                  name="year"
                                  value={editableTaskDate.year}
                                  onChange={(e) => handleDateChange(e)}
                                />
                              </div>
                              <div className="border-top border-2 border-dark">
                                <input
                                  type="number"
                                  placeholder="Month"
                                  min="1"
                                  max="12"
                                  className="w-100 px-1 py-2 font-weight-bold text-body"
                                  name="month"
                                  value={editableTaskDate.month}
                                  onChange={(e) => handleDateChange(e)}
                                />
                              </div>
                              <div className="border-top border-2 border-dark">
                                <input
                                  type="number"
                                  placeholder="Day"
                                  min="1"
                                  max="31"
                                  className="w-100 px-1 py-2 font-weight-bold text-body"
                                  name="day"
                                  value={editableTaskDate.day}
                                  onChange={(e) => handleDateChange(e)}
                                />
                              </div>
                            </>
                          ) : task.date !== undefined ? (
                            formatDate(task.date)
                          ) : (
                            "-"
                          )}
                        </div>
                        {/* TODO amount of time left */}
                      </div>
                      <div
                        onClick={() => setSelectedTaskIndex(i)}
                        className={`border-left border-2 border-dark flex-72 ${i === selectedTaskIndex ? "" : "editable"}`}>
                        <div className="d-flex flex-wrap align-items-start">
                          {i === selectedTaskIndex && list.creator === user._id && (
                            <div className="border-bottom border-2 border-dark ">
                              <Autocomplete
                                placeholder="Add..."
                                suggestions={[...allUsers]}
                                name="collaborators"
                                value={collaboratorSearchField}
                                relevantAttributeNames={["firstname", "lastname", "email"]}
                                className="editable small-bold text-body w-100 h-100 d-block px-1 py-2"
                                onChange={(e) => setCollaboratorSearchField(e.target.value)}
                                onSelect={(e) => handleAddCollaborator(e)}
                                SuggestionsList={({ filteredSuggestions, activeSuggestion, onClick }) =>
                                  filteredSuggestions.length ? (
                                    <ul className="suggestions small-bold border-top border-bottom border-left border-2 border-dark bg-white">
                                      {filteredSuggestions.map((suggestion, i) => (
                                        <li
                                          className={`p-1 clickable text-left ${i > 0 ? "border-top border-2 border-dark" : ""}`}
                                          key={i}
                                          onClick={(e) => onClick(e, suggestion)}>
                                          <div className={`text-white px-2 pt-2 bg-dark ${i === activeSuggestion ? "text-underlined" : ""}`}>
                                            {suggestion.firstname} {suggestion.lastname}
                                          </div>
                                          <div className="text-secondary px-2 pb-2 bg-dark">{suggestion.email}</div>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <ul className="suggestions small-bold border-top border-bottom border-left border-2 border-dark">
                                      <div className="py-2 px-3 bg-dark text-secondary font-italic">No results found</div>
                                    </ul>
                                  )
                                }
                              />
                            </div>
                          )}
                          {(i === selectedTaskIndex ? editableTask : task).collaborators.map((collaborator, j) => (
                            <div
                              key={j}
                              onMouseOver={(e) => loadAllUsersOnce() && setTooltipUserID(collaborator._id)}
                              onMouseLeave={(e) =>
                                setTimeout(() => {
                                  setTooltipUserID("");
                                }, 50)
                              }
                              style={{ height: 33, width: 32, marginTop: 2, marginLeft: 2, marginRight: j % 2 !== 0 ? 2 : 0 }}
                              className={`small-bold text-center py-2 text-white bg-dark position-relative`}>
                              {collaborator.firstname.substring(0, 1)}
                              {collaborator.lastname.substring(0, 1)}
                              <UserTooltip
                                index={j}
                                visible={collaborator._id === tooltipUserID}
                                userID={collaborator._id}
                                allUsers={allUsers}
                                showRemove={i === selectedTaskIndex && list.creator === user._id}
                                onRemoveClick={(e) => handleRemoveCollaborator(e, j)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
              )}
            {selectedTaskIndex === -1 && list.creator === user._id && (
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
        )
      )}
    </Fragment>
  );
};

const UserTooltip = ({ visible, userID, allUsers, showRemove, onRemoveClick, index }) => {
  const user = allUsers.filter((user) => user._id === userID)[0];
  return visible && user ? (
    allUsers.length > 0 ? (
      <div
        className="border border-2 border-dark position-absolute text-left bg-dark"
        style={{ top: index > 1 ? "unset" : 0, bottom: index > 1 ? 0 : "unset", right: "100%" }}>
        <div className={`text-white px-2 pt-2 bg-dark border-0`}>
          {user.firstname} {user.lastname}
        </div>
        <div className="text-secondary px-2 pb-2 bg-dark">{user.email}</div>
        {showRemove && (
          <div className="bg-white">
            <div className={`clickable text-nowrap p-2 text-left text-body`} onClick={(e) => onRemoveClick(e)}>
              REMOVE COLLABORATOR
            </div>
          </div>
        )}
      </div>
    ) : (
      <Loading />
    )
  ) : (
    <></>
  );
};

export default List;
