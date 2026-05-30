import { useEffect, useState } from "react";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

function MyTasks() {

  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks =
    async () => {

      try {

        const response =
          await api.get(
            "/tasks/my"
          );

        setTasks(
          response.data
        );

      } catch (err) {

        console.log(err);
      }
    };

  return (

    <MainLayout>

      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        My Tasks
      </h1>

      <div
        className="
        grid
        gap-4
        "
      >

        {tasks.map((task) => (

          <div
            key={task._id}
            className="
            bg-white
            p-5
            rounded-xl
            shadow
            "
          >

            <h2
              className="
              text-xl
              font-bold
              "
            >
              {task.title}
            </h2>

            <p>
              {task.description}
            </p>

            <p>
              Status:
              {" "}
              {task.status}
            </p>

            <p>
              Priority:
              {" "}
              {task.priority}
            </p>

          </div>

        ))}

      </div>

    </MainLayout>

  );
}

export default MyTasks;