import { useEffect, useState } from "react";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

function AllTasks() {

  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks =
    async () => {

      try {

        const response =
          await api.get("/tasks/");

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
        All Tasks
      </h1>

      <div
        className="
        bg-white
        rounded-xl
        shadow
        overflow-hidden
        "
      >

        <table
          className="
          w-full
          "
        >

          <thead
            className="
            bg-slate-100
            "
          >

            <tr>

              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Priority
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Due Date
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.map((task) => (

              <tr
                key={task._id}
                className="border-t"
              >

<td className="p-4">

<Link
  to={`/tasks/${task._id}`}
  className="
  text-blue-600
  hover:underline
  "
>
  {task.title}
</Link>

</td>

                <td className="p-4">
                  {task.priority}
                </td>

                <td className="p-4">
                  {task.status}
                </td>

                <td className="p-4">
                  {
                    new Date(
                      task.due_date
                    ).toLocaleDateString()
                  }
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </MainLayout>

  );
}

export default AllTasks;