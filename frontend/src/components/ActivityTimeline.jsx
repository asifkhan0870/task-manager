import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";

function ActivityTimeline({ taskId }) {

  const [activities, setActivities] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (taskId) {

      fetchActivities();
      fetchUsers();

    }

  }, [taskId]);

  const fetchUsers =
    async () => {

      try {

        const response =
          await api.get(
            "/users/"
          );

        setUsers(
          response.data || []
        );

      } catch (err) {

        console.log(err);

      }
    };

  const fetchActivities =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get(
            `/activity/${taskId}`
          );

        setActivities(
          response.data || []
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load activity timeline"
        );

      } finally {

        setLoading(false);

      }
    };

  const getUserName =
    (userId) => {

      const user =
        users.find(
          (u) =>
            u._id === userId
        );

      return user
        ? user.name
        : userId;
    };

  if (loading) {

    return (
      <div
        className="
        bg-white
        rounded-xl
        shadow
        p-6
        mt-8
        "
      >
        Loading activity...
      </div>
    );
  }

  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow
      p-6
      mt-8
      "
    >

      <h2
        className="
        text-2xl
        font-bold
        mb-6
        "
      >
        Activity Timeline
      </h2>

      {
        activities.length === 0 && (
          <p
            className="
            text-gray-500
            "
          >
            No activity found.
          </p>
        )
      }

      <div
        className="
        space-y-4
        "
      >

        {activities.map(
          (activity) => (

            <div
              key={activity._id}
              className="
              border-l-4
              border-blue-500
              pl-4
              py-2
              "
            >

              <p
                className="
                font-semibold
                "
              >
                {activity.action}
              </p>

              <p
                className="
                text-sm
                text-gray-600
                "
              >
                By:
                {" "}
                {
                  getUserName(
                    activity.performed_by
                  )
                }
              </p>

              <p
                className="
                text-sm
                text-gray-500
                "
              >
                {
  new Date(
    activity.timestamp
  ).toLocaleString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  )
}
              </p>

            </div>

          )
        )}

      </div>

    </div>

  );
}

export default ActivityTimeline;