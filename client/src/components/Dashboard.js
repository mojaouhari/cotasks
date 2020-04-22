import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import Loading from "./Loading";

const Dashboard = () => {
  const [userLists, setUserLists] = useState([]);
  const [othersLists, setOthersLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openListId, setOpenListId] = useState(null);

  const loadLists = async () => {
    const res = await Axios.get("/lists/");
    setUserLists(res.data.userLists);
    setOthersLists(res.data.othersLists);
    setLoading(false);
  };

  const createList = async () => {
    const res = await Axios.post("/lists/", { name: "<NEW LIST>" });
    setOpenListId(res.data._id);
  };

  useEffect(() => {
    loadLists();
  }, []);

  if (openListId) return <Redirect to={`/list/${openListId}`} />;

  return (
    <div className="border border-2 border-dark m-2">
      <div className={`p-3 text-left`}>
        <div className="h1 m-0">CoTasks</div>
      </div>
      {loading ? (
        <div className="border-top border-2 border-dark">
          <Loading />
        </div>
      ) : (
        <div className="">
          <div className="bg-dark text-white-50 small-bold">
            <div className="p-2 flex-72">YOUR LISTS</div>
          </div>
          {userLists.map((list, i) => (
            <div className="border-top border-2 border-dark clickable text-left p-0" key={i}>
              <Link to={`/list/${list._id}`} className="p-3 text-body text-decoration-none d-block">
                {list.name}
                <div className="small-bold">
                  {list.taskCount} tasks · {list.doneCount} done
                </div>
              </Link>
            </div>
          ))}
          <div className="bg-dark text-white-50 small-bold">
            <div className="p-2 flex-72">OTHER PEOPLE'S LISTS</div>
          </div>
          {othersLists.map((list, i) => (
            <div className="border-top border-2 border-dark clickable text-left p-0" key={i}>
              <Link to={`/list/${list._id}`} className="p-3 text-body text-decoration-none d-block">
                {list.name}
                <div className="small-bold">
                  by {list.creator.firstname} {list.creator.lastname} <br />
                  {list.taskCount} (out of {list.totalCount}) tasks · {list.doneCount} done
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      <div onClick={() => createList()} className="border-top border-2 border-dark clickable text-left p-3">
        CREATE A NEW LIST
      </div>
    </div>
  );
};

export default Dashboard;
