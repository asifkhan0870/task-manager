import {
    LayoutDashboard,
    ClipboardList,
    User,
    PlusCircle,
    X
  } from "lucide-react";
  
  import { Link } from "react-router-dom";
  
  function Sidebar({
    sidebarOpen,
    setSidebarOpen
  }) {
  
    return (
  
      <>
  
        {
          sidebarOpen && (
  
            <div
              onClick={() =>
                setSidebarOpen(false)
              }
              className="
              fixed
              inset-0
              bg-black/50
              z-40
              md:hidden
              "
            />
  
          )
        }
  
        <div
          className={`
            fixed
            md:static
            top-0
            left-0
            z-50
            h-screen
            w-72
            bg-slate-950
            text-white
            flex
            flex-col
            transform
            transition-transform
            duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
          `}
        >
  
          <div
            className="
            p-6
            border-b
            border-slate-800
            flex
            justify-between
            items-center
            "
          >
  
            <div>
  
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
  
            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="
              md:hidden
              "
            >
              <X size={24}/>
            </button>
  
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
              onClick={() =>
                setSidebarOpen(false)
              }
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
              onClick={() =>
                setSidebarOpen(false)
              }
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
              onClick={() =>
                setSidebarOpen(false)
              }
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
              onClick={() =>
                setSidebarOpen(false)
              }
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
  
          </nav>
  
        </div>
  
      </>
  
    );
  }
  
  export default Sidebar;