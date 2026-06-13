import { useEffect, useState } from "react";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

import StatsCard from "../components/StatsCard";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    in_progress: 0,
    incomplete: 0,
    overdue: 0,
  });

  const [tasks, setTasks] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("Total Tasks");

  useEffect(() => {
    fetchStats();

    loadAllTasks();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");

      setStats(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAllTasks = async () => {
    try {
      const response = await api.get("/tasks/");

      setTasks(response.data);

      setSelectedFilter("Total Tasks");
    } catch (err) {
      console.log(err);
    }
  };

  const loadCompletedTasks = async () => {
    try {
      const response = await api.get("/tasks/completed");

      setTasks(response.data);

      setSelectedFilter("Done");
    } catch (err) {
      console.log(err);
    }
  };

  const loadInProgressTasks = async () => {
    try {
      const response = await api.get("/tasks/in-progress");

      setTasks(response.data);

      setSelectedFilter("In Progress");
    } catch (err) {
      console.log(err);
    }
  };

  const loadIncompleteTasks = async () => {
    try {
      const response = await api.get("/tasks/incomplete");

      setTasks(response.data);

      setSelectedFilter("Incomplete");
    } catch (err) {
      console.log(err);
    }
  };

  const loadOverdueTasks = async () => {
    try {
      const response = await api.get("/tasks/overdue");

      setTasks(response.data);

      setSelectedFilter("Overdue");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <h1
        className="
          text-4xl
          font-bold
          mb-8
          "
      >
        Dashboard
      </h1>

      <div
        className="
          grid
grid-cols-2
lg:grid-cols-5
gap-4
          "
      >
        <div className="cursor-pointer" onClick={loadAllTasks}>
          <StatsCard title="Total Tasks" value={stats.total} />
        </div>

        <div className="cursor-pointer" onClick={loadCompletedTasks}>
          <StatsCard title="Done" value={stats.done} />
        </div>

        <div className="cursor-pointer" onClick={loadInProgressTasks}>
          <StatsCard title="In Progress" value={stats.in_progress} />
        </div>

        <div className="cursor-pointer" onClick={loadIncompleteTasks}>
          <StatsCard title="Incomplete" value={stats.incomplete} />
        </div>

        <div className="cursor-pointer" onClick={loadOverdueTasks}>
          <StatsCard title="Overdue" value={stats.overdue} />
        </div>
      </div>

      <div className="mt-10">
        <h2
          className="
            text-2xl
            font-bold
            mb-4
            "
        >
          {selectedFilter}
        </h2>

        <div
          className="
            bg-white
            rounded-lg
            shadow
            overflow-x-auto
            "
        >
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full">
              <thead>
                <tr
                  className="
                  bg-gray-100
                  text-left
                  "
                >
                  <th className="p-3">Title</th>

                  <th className="p-3">Priority</th>

                  <th className="p-3">Status</th>

                  <th className="p-3">Due Date</th>
                </tr>
              </thead>

              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="
                      border-t
                      "
                    >
                      <td className="p-3">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="
    text-blue-600
    hover:underline
    font-medium
    "
                        >
                          {task.title}
                        </Link>
                      </td>

                      <td className="p-3">{task.priority}</td>

                      <td className="p-3">{task.status}</td>

                      <td className="p-3">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="
                      text-center
                      p-6
                      "
                    >
                      No Tasks Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
