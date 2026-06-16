import {
  LogOut,
  Menu,
  KeyRound
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Navbar({
  setSidebarOpen
}) {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";
  };

  return (

    <header
      className="
      sticky
      top-0
      z-30
      h-20
      bg-white
      border-b
      border-slate-200
      shadow-sm
      flex
      justify-between
      items-center
      px-4
      md:px-8
      "
    >

      <div
        className="
        flex
        items-center
        gap-3
        "
      >

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
          md:hidden
          "
        >
          <Menu size={28}/>
        </button>

        <h1
          className="
          text-xl
          md:text-3xl
          font-bold
          text-slate-900
          "
        >
          Task Manager
        </h1>

      </div>

      <div
        className="
        flex
        items-center
        gap-3
        "
      >

        <button
          onClick={() =>
            navigate("/change-password")
          }
          className="
          flex
          items-center
          gap-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-4
          md:px-5
          py-2
          rounded-lg
          transition
          "
        >
          <KeyRound size={18}/>
          Password
        </button>

        <button
          onClick={logout}
          className="
          flex
          items-center
          gap-2
          bg-red-500
          hover:bg-red-600
          text-white
          px-4
          md:px-5
          py-2
          rounded-lg
          transition
          "
        >
          <LogOut size={18}/>
          Logout
        </button>

      </div>

    </header>

  );
}

export default Navbar;