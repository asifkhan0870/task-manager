import {
    useEffect,
    useState
  } from "react";
  
  import {
    useParams,
    useNavigate
  } from "react-router-dom";
  
  import api from "../api/axios";
  
  import MainLayout from "../layouts/MainLayout";
  
  function TaskDetails() {
  
    const { id } =
      useParams();
  
    const navigate =
      useNavigate();
  
    const [task, setTask] =
      useState(null);
  
    useEffect(() => {
  
      fetchTask();
  
    }, []);
  
    const fetchTask =
      async () => {
  
        try {
  
          const response =
            await api.get(
              `/tasks/id/${id}`
            );
  
          setTask(
            response.data
          );
  
        } catch (err) {
  
          console.log(err);
        }
      };
  
    const deleteTask =
      async () => {
  
        const confirmDelete =
          window.confirm(
            "Delete this task?"
          );
  
        if (!confirmDelete)
          return;
  
        try {
  
          await api.delete(
            `/tasks/id/${id}`
          );
  
          alert(
            "Task Deleted"
          );
  
          navigate(
            "/tasks"
          );
  
        } catch (err) {
  
          console.log(err);
        }
      };
  
    const updateStatus =
      async (status) => {
  
        try {
  
          await api.patch(
            `/tasks/id/${id}/status`,
            {
              status
            }
          );
  
          fetchTask();
  
        } catch (err) {
  
          console.log(err);
        }
      };
  
    if (!task)
      return (
        <MainLayout>
          Loading...
        </MainLayout>
      );
  
    return (
  
      <MainLayout>
  
        <div
          className="
          bg-white
          rounded-xl
          shadow
          p-8
          "
        >
  
          <h1
            className="
            text-4xl
            font-bold
            mb-6
            "
          >
            {task.title}
          </h1>
  
          <p
            className="
            mb-4
            "
          >
            {task.description}
          </p>
  
          <p>
            <b>Priority:</b>
            {" "}
            {task.priority}
          </p>
  
          <p>
            <b>Status:</b>
            {" "}
            {task.status}
          </p>
  
          <p>
            <b>Assigned By:</b>
            {" "}
            {task.assigned_by}
          </p>
  
          <p>
            <b>Assigned To:</b>
            {" "}
            {task.assigned_to}
          </p>
  
          <p>
            <b>Due Date:</b>
            {" "}
            {
              new Date(
                task.due_date
              ).toLocaleString()
            }
          </p>
  
          <div
            className="
            flex
            gap-4
            mt-8
            "
          >
  
            <button
              onClick={() =>
                updateStatus(
                  "In Progress"
                )
              }
              className="
              bg-yellow-500
              text-white
              px-4
              py-2
              rounded
              "
            >
              In Progress
            </button>
  
            <button
              onClick={() =>
                updateStatus(
                  "Done"
                )
              }
              className="
              bg-green-600
              text-white
              px-4
              py-2
              rounded
              "
            >
              Mark Done
            </button>
  
            <button
              onClick={deleteTask}
              className="
              bg-red-600
              text-white
              px-4
              py-2
              rounded
              "
            >
              Delete
            </button>
  
          </div>
  
        </div>
  
      </MainLayout>
  
    );
  }
  
  export default TaskDetails;