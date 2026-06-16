import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function NotificationDrawer({
  open,
  onClose,
  refreshCount
}) {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (open) {
      fetchNotifications();
    }

  }, [open]);

  const fetchNotifications = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/notifications/");

      setNotifications(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const openNotification =
    async (item) => {

      try {

        /*
        Mark ALL notifications
        for this task as read
        */

        await api.patch(
          `/notifications/task/${item.task_id}/read`
        );

        /*
        Remove them immediately
        from drawer
        */

        const remaining =
  notifications.filter(
    n => n.task_id !== item.task_id
  );

setNotifications(remaining);

if (remaining.length === 0) {
  onClose();
}

        /*
        Refresh bell count
        */

        if (refreshCount) {
          refreshCount();
        }

        onClose();

        navigate(
          `/tasks/${item.task_id}?discussion=true`
        );

      } catch (err) {

        console.error(err);

      }

    };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}

      <div
        className="
        fixed
        inset-0
        bg-black/30
        z-40
        "
        onClick={onClose}
      />

      {/* Drawer */}

      <div
        className="
        fixed
        top-0
        right-0
        h-screen
        w-[420px]
        bg-white
        shadow-2xl
        z-50
        overflow-y-auto
        "
      >

        {/* Header */}

        <div
          className="
          p-5
          border-b
          sticky
          top-0
          bg-white
          z-10
          "
        >
          <h2
            className="
            text-3xl
            font-bold
            "
          >
            Notifications
          </h2>
        </div>

        {/* Content */}

        <div className="p-4">

          {loading ? (

            <p className="text-center">
              Loading...
            </p>

          ) : notifications.length === 0 ? (

            <div
              className="
              text-center
              text-slate-500
              mt-12
              "
            >
              No notifications
            </div>

          ) : (

            notifications.map(item => (

              <div
                key={item._id}
                onClick={() =>
                  openNotification(item)
                }
                className="
                border
                border-slate-200
                rounded-2xl
                p-4
                mb-4
                cursor-pointer
                hover:bg-slate-50
                transition
                "
              >

                <div
                  className="
                  flex
                  justify-between
                  items-start
                  "
                >

                  <div>

                    <h3
                      className="
                      font-bold
                      text-xl
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                      text-slate-700
                      mt-1
                      "
                    >
                      {item.message}
                    </p>

                    <p
                      className="
                      text-slate-500
                      mt-2
                      "
                    >
                      {item.preview}
                    </p>

                    <p
                      className="
                      text-xs
                      text-slate-400
                      mt-3
                      "
                    >
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  <span
                    className="
                    bg-red-500
                    text-white
                    text-xs
                    px-3
                    py-1
                    rounded-full
                    font-semibold
                    "
                  >
                    New
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </>
  );

}

export default NotificationDrawer;