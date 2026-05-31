import {
    useEffect,
    useState
  } from "react";
  
  import {
    useParams,
    useNavigate
  } from "react-router-dom";
  
  import toast from "react-hot-toast";
  
  import api from "../api/axios";
  
  import MainLayout from "../layouts/MainLayout";
  
  function TaskDetails() {
  
    const { id } =
      useParams();
  
    const navigate =
      useNavigate();
  
    const [task, setTask] =
      useState(null);
  
    const [loadingAction, setLoadingAction] =
      useState("");
  
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
  
          toast.error(
            "Failed to load task"
          );
        }
      };
  
    const deleteTask =
      async () => {
  
        if (loadingAction) return;
  
        const confirmDelete =
          window.confirm(
            "Delete this task?"
          );
  
        if (!confirmDelete)
          return;
  
        setLoadingAction(
          "delete"
        );
  
        const loadingToast =
          toast.loading(
            "Deleting task..."
          );
  
        try {
  
          await api.delete(
            `/tasks/id/${id}`
          );
  
          toast.success(
            "Task deleted successfully",
            {
              id: loadingToast
            }
          );
  
          navigate(
            "/tasks"
          );
  
        } catch (err) {
  
          console.log(err);
  
          toast.error(
            "Failed to delete task",
            {
              id: loadingToast
            }
          );
  
        } finally {
  
          setLoadingAction(
            ""
          );
  
        }
      };
  
    const updateStatus =
      async (status) => {
  
        if (loadingAction) return;
  
        setLoadingAction(
          status
        );
  
        const loadingToast =
          toast.loading(
            `Updating status...`
          );
  
        try {
  
          await api.patch(
            `/tasks/id/${id}/status`,
            {
              status
            }
          );
  
          await fetchTask();
  
          toast.success(
            `Status updated to ${status}`,
            {
              id: loadingToast
            }
          );
  
        } catch (err) {
  
          console.log(err);
  
          toast.error(
            "Failed to update status",
            {
              id: loadingToast
            }
          );
  
        } finally {
  
          setLoadingAction(
            ""
          );
  
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
              disabled={
                !!loadingAction
              }
              onClick={() =>
                updateStatus(
                  "In Progress"
                )
              }
              className={`
                text-white
                px-4
                py-2
                rounded
                ${
                  loadingAction
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-yellow-500"
                }
              `}
            >
              {
                loadingAction ===
                "In Progress"
                  ? "Updating..."
                  : "In Progress"
              }
            </button>
  
            <button
              disabled={
                !!loadingAction
              }
              onClick={() =>
                updateStatus(
                  "Done"
                )
              }
              className={`
                text-white
                px-4
                py-2
                rounded
                ${
                  loadingAction
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600"
                }
              `}
            >
              {
                loadingAction ===
                "Done"
                  ? "Updating..."
                  : "Mark Done"
              }
            </button>
  
            <button
              disabled={
                !!loadingAction
              }
              onClick={deleteTask}
              className={`
                text-white
                px-4
                py-2
                rounded
                ${
                  loadingAction
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600"
                }
              `}
            >
              {
                loadingAction ===
                "delete"
                  ? "Deleting..."
                  : "Delete"
              }
            </button>
  
          </div>
  
        </div>
  
        {
          loadingAction && (
            <div
              className="
              fixed
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              z-50
              "
            >
              <div
                className="
                bg-white
                px-8
                py-6
                rounded-xl
                shadow-xl
                text-lg
                font-semibold
                "
              >
                Processing...
                Please wait.
              </div>
            </div>
          )
        }
  
      </MainLayout>
  
    );
  }
  
  export default TaskDetails;