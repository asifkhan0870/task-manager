import { LogOut } from "lucide-react";

function Navbar() {

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    window.location.href = "/";
  };

  return (

    <div
      className="
      bg-white
      h-20
      shadow-sm
      flex
      justify-between
      items-center
      px-8
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

      <button
        onClick={logout}
        className="
        flex
        items-center
        gap-2
        bg-red-500
        hover:bg-red-600
        text-white
        px-5
        py-2
        rounded-lg
        "
      >
        <LogOut size={18}/>
        Logout
      </button>

    </div>
  );
}

export default Navbar;