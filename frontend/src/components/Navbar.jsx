import {
  LogOut,
  Menu,
  KeyRound,
  Bell
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import NotificationDrawer
from "./NotificationDrawer";

function Navbar({
  setSidebarOpen
}) {

  const navigate = useNavigate();

  // Temporary count until backend notifications are connected
  const [notificationCount, setNotificationCount] =
  useState(0);
  const [
    showNotifications,
    setShowNotifications
  ] = useState(false);


  const loadNotifications = async () => {

    try {
  
      const res = await api.get(
        "/notifications/unread-count"
      );
  
      setNotificationCount(
        res.data.count || 0
      );
  
    } catch (err) {
  
      console.error(err);
  
    }
  
  };
  
  useEffect(() => {
  
    loadNotifications();
  
  }, []);



  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";
  };

  return (

    <>

<header
  className="
  fixed
  top-0
  left-0
  right-0
  md:left-72
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

        {/* Notification Bell */}

        <button
          onClick={() =>
            setShowNotifications(
              !showNotifications
            )
          }
          className="
          relative
          flex
          items-center
          justify-center
          w-11
          h-11
          bg-white
          border
          border-slate-200
          rounded-xl
          hover:bg-slate-50
          transition
          "
        >
          <Bell size={20} />

          {notificationCount > 0 && (
            <span
              className="
              absolute
              -top-1
              -right-1
              min-w-[20px]
              h-5
              px-1
              rounded-full
              bg-red-500
              text-white
              text-[10px]
              font-bold
              flex
              items-center
              justify-center
              "
            >
              {notificationCount}
            </span>
          )}
        </button>

        {/* Change Password */}

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

        {/* Logout */}

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

<NotificationDrawer
  open={showNotifications}
  onClose={() =>
    setShowNotifications(false)
  }
  refreshCount={loadNotifications}
/>

</>

  );
}

export default Navbar;