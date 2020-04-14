import React, { useEffect, useState, Fragment } from "react";
import Axios from "axios";
import { formatDate } from "../utils";

const List = ({
  match: {
    params: { id },
  },
}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});

  const loadList = async (id) => {
    const res = await Axios.get(`/lists/${id}`);
    setList(res.data);
    setLoading(false);
    // console.log(res.data);
  };

  const toggleDone = async (task, i) => {
    task.done = !task.done;
    const res = await Axios.post(`/lists/${id}/${i}`, task);
    // TODO add trycatch to show a toast notification
  };

  useEffect(() => {
    loadList(id);
  }, [id, toggleDone]);

  useEffect(() => {
    // console.log(list);
  }, [list]);

  // TODO add loading component

  return (
    <Fragment>
      {loading ? (
        <div>LOADING</div>
      ) : (
        <div className="border border-2 border-dark m-2">
          <div className="d-flex flex-row">
            <div className="p-3 flex-grow-1">{list.name}</div>
            <div className="p-3 border-left border-2 border-dark bg-white-50">EDIT</div>
            <div className="p-3 border-left border-2 border-dark bg-white-50">ADD A TASK</div>
          </div>
          <div className="d-flex flex-row bg-dark text-white-50 border-top border-2 border-dark small">
            <div className="p-2 flex-104">DONE?</div>
            <div className="border-left border-2 border-dark p-2 flex-grow-1">TASK</div>
            <div className="border-left border-2 border-dark p-2 flex-104">DATE</div>
            <div className="border-left border-2 border-dark p-2 flex-232">COLLABORATORS</div>
          </div>
          {list.tasks.map((task, i) => (
            <div className={`d-flex flex-row border-top border-2 border-dark ${task.done ? "text-muted" : ""}`} key={i}>
              <button
                className={`flex-104 p-2 bg-white-50 border-0 done-btn-${task.done ? "yes" : "no"}`}
                onClick={() => toggleDone(task, i)}
              />
              <div className="border-left border-2 border-dark p-2 flex-grow-1">{task.name}</div>
              <div className="border-left border-2 border-dark p-2 flex-104 small">{task.date !== undefined ? formatDate(task.date) : "-"}</div>
              <div className="border-left border-2 border-dark p-2 flex-232">...</div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default List;
