import { useEffect, useState } from "react";
import api from "../api/axios";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {

    try {

      const res =
        await api.get("/notifications/");

      setNotifications(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (

        <div className="bg-white p-6 rounded-xl shadow">
          No notifications found
        </div>

      ) : (

        notifications.map(item => (

          <div
            key={item._id}
            className="
            bg-white
            rounded-xl
            shadow
            p-4
            mb-4
            border
            "
          >

            <div className="flex justify-between">

              <h3 className="font-bold text-lg">
                {item.title}
              </h3>

              {!item.read && (
                <span
                  className="
                  bg-red-500
                  text-white
                  text-xs
                  px-2
                  py-1
                  rounded-full
                  "
                >
                  New
                </span>
              )}

            </div>

            <p className="mt-2 text-slate-700">
              {item.message}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {item.preview}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {new Date(
                item.created_at
              ).toLocaleString()}
            </p>

          </div>

        ))

      )}

    </div>

  );

}

export default Notifications;