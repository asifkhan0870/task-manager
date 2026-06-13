import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  Done: "bg-green-100 text-green-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Incomplete: "bg-amber-100 text-amber-800",
  Overdue: "bg-red-100 text-red-800",
};

const FILTERS = [
  { key: "all", label: "All Tasks" },
  { key: "done", label: "Done" },
  { key: "inprogress", label: "In Progress" },
  { key: "incomplete", label: "Incomplete" },
  { key: "overdue", label: "Overdue" },
];

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    in_progress: 0,
    incomplete: 0,
    overdue: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("Total Tasks");

  useEffect(() => {
    fetchStats();
    loadTasks("all");
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const ENDPOINTS = {
    all: "/tasks/",
    done: "/tasks/completed",
    inprogress: "/tasks/in-progress",
    incomplete: "/tasks/incomplete",
    overdue: "/tasks/overdue",
  };

  const loadTasks = async (filter) => {
    try {
      const response = await api.get(ENDPOINTS[filter]);
      setTasks(response.data);
      setSelectedFilter(filter);
      setSelectedLabel(FILTERS.find((f) => f.key === filter)?.label || "");
    } catch (err) {
      console.log(err);
    }
  };

  const CARDS = [
    {
      key: "all",
      label: "Total Tasks",
      value: stats.total,
      icon: "ti-layout-list",
      color: "text-violet-600",
      bg: "bg-violet-50",
      wide: true,
    },
    {
      key: "done",
      label: "Done",
      value: stats.done,
      icon: "ti-circle-check",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      key: "inprogress",
      label: "In Progress",
      value: stats.in_progress,
      icon: "ti-progress",
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      key: "incomplete",
      label: "Incomplete",
      value: stats.incomplete,
      icon: "ti-clock-exclamation",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      key: "overdue",
      label: "Overdue",
      value: stats.overdue,
      icon: "ti-alert-circle",
      color: "text-red-700",
      bg: "bg-red-50",
    },
  ];

  return (
    <MainLayout>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {CARDS.map((card) => (
          <div
            key={card.key}
            onClick={() => loadTasks(card.key)}
            className={`
              bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer
              active:scale-95 transition-transform
              ${card.wide ? "col-span-2" : ""}
            `}
          >
            <i
              className={`ti ${card.icon} text-lg mb-2 block ${card.color}`}
              aria-hidden="true"
            />
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => loadTasks(f.key)}
            className={`
              text-xs px-4 py-1.5 rounded-full border whitespace-nowrap transition-all
              ${
                selectedFilter === f.key
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-500 border-gray-200"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-base font-semibold mb-3 text-gray-800">
        {selectedLabel}
      </h2>

      {/* Task List — card-based on mobile, no horizontal scroll */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {tasks.length > 0 ? (
          <>
            {/* Header row — hidden on mobile, shown on sm+ */}
            <div className="hidden sm:grid grid-cols-4 px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Title</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Due Date</span>
            </div>

            {tasks.map((task) => (
              <div
                key={task._id}
                className="border-t border-gray-100 px-4 py-3 flex flex-col gap-1.5 sm:grid sm:grid-cols-4 sm:items-center"
              >
                {/* Title */}
                <Link
                  to={`/tasks/${task._id}`}
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  {task.title}
                </Link>

                {/* Meta row on mobile */}
                <div className="flex items-center gap-2 flex-wrap sm:contents">
                  {/* Priority */}
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {task.priority}
                  </span>

                  {/* Status */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      STATUS_STYLES[task.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {task.status}
                  </span>

                  {/* Due Date */}
                  <span className="text-xs text-gray-400 ml-auto sm:ml-0">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <i className="ti ti-mood-empty text-3xl mb-2" aria-hidden="true" />
            <p className="text-sm">No tasks found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;