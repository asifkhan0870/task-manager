import {
    LayoutDashboard,
    ClipboardList,
    User,
    PlusCircle,
    Activity
  } from "lucide-react";
  
  import { Link } from "react-router-dom";
  
  function Sidebar() {
  
    return (
  
      <div
        className="
        w-72
        min-h-screen
        bg-slate-950
        text-white
        flex
        flex-col
        "
      >
  
        <div
          className="
          p-6
          border-b
          border-slate-800
          "
        >
  
          <h1
            className="
            text-3xl
            font-bold
            "
          >
            Task Manager
          </h1>
  
          <p
            className="
            text-slate-400
            text-sm
            mt-2
            "
          >
            Productivity Dashboard
          </p>
  
        </div>
  
        <nav
          className="
          flex-1
          p-4
          space-y-2
          "
        >
  
          <Link
            to="/dashboard"
            className="
            flex
            items-center
            gap-3
            p-3
            rounded-lg
            hover:bg-slate-800
            "
          >
            <LayoutDashboard size={20}/>
            Dashboard
          </Link>
  
          <Link
            to="/tasks"
            className="
            flex
            items-center
            gap-3
            p-3
            rounded-lg
            hover:bg-slate-800
            "
          >
            <ClipboardList size={20}/>
            All Tasks
          </Link>
  
          <Link
            to="/my-tasks"
            className="
            flex
            items-center
            gap-3
            p-3
            rounded-lg
            hover:bg-slate-800
            "
          >
            <User size={20}/>
            My Tasks
          </Link>
  
          <Link
            to="/create-task"
            className="
            flex
            items-center
            gap-3
            p-3
            rounded-lg
            hover:bg-slate-800
            "
          >
            <PlusCircle size={20}/>
            Create Task
          </Link>
  
          <Link
            to="/activity"
            className="
            flex
            items-center
            gap-3
            p-3
            rounded-lg
            hover:bg-slate-800
            "
          >
            <Activity size={20}/>
            Activity
          </Link>
  
        </nav>
  
      </div>
    );
  }
  
  export default Sidebar;