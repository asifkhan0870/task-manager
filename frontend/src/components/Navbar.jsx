import {
  LogOut,
  Menu
} from "lucide-react";

function Navbar({
  setSidebarOpen
}) {

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

    </header>

  );
}

export default Navbar;