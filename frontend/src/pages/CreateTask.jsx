import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

function CreateTask() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const payload =
        JSON.parse(
          atob(token.split(".")[1])
        );

      const loggedInEmail =
        payload.email;

      const response =
        await api.get("/users/");

      const filteredUsers =
        response.data.filter(
          (user) =>
            user.email !==
            loggedInEmail
        );

      setUsers(filteredUsers);

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load users"
      );
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const loadingToast =
      toast.loading(
        "Creating task..."
      );

    try {

      await api.post(
        "/tasks/",
        {
          title,
          description,
          priority,
          assigned_to:
            assignedTo,
          due_date:
            dueDate
        }
      );

      toast.success(
        "Task created successfully",
        {
          id: loadingToast
        }
      );

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setAssignedTo("");
      setDueDate("");

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to create task",
        {
          id: loadingToast
        }
      );

    } finally {

      setIsSubmitting(false);

    }
  };

  const selectedUser =
    users.find(
      (u) =>
        u._id === assignedTo
    );

  return (

    <MainLayout>

      <div className="mb-8">

        <h1
          className="
          text-4xl
          font-bold
          text-slate-900
          "
        >
          ✨ Create New Task
        </h1>

        <p
          className="
          text-slate-500
          mt-2
          "
        >
          Create and assign work to
          your team members.
        </p>

      </div>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
        mb-8
        "
      >

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          border
          border-slate-200
          "
        >

          <p
            className="
            text-slate-500
            text-sm
            "
          >
            Priority
          </p>

          <h3
            className="
            text-xl
            font-bold
            mt-2
            "
          >
            {
              priority === "High"
                ? "🔴 High"
                : priority === "Medium"
                ? "🟡 Medium"
                : "🟢 Low"
            }
          </h3>

        </div>

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          border
          border-slate-200
          "
        >

          <p
            className="
            text-slate-500
            text-sm
            "
          >
            Assignee
          </p>

          <h3
            className="
            text-xl
            font-bold
            mt-2
            "
          >
            {
              selectedUser
                ? selectedUser.name
                : "Not Selected"
            }
          </h3>

        </div>

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          border
          border-slate-200
          "
        >

          <p
            className="
            text-slate-500
            text-sm
            "
          >
            Due Date
          </p>

          <h3
            className="
            text-lg
            font-bold
            mt-2
            "
          >
            {
              dueDate
                ? "📅 Scheduled"
                : "Not Set"
            }
          </h3>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        p-8
        rounded-3xl
        shadow-xl
        border
        border-slate-200
        "
      >

        <label
          className="
          block
          text-sm
          font-medium
          text-slate-700
          mb-2
          "
        >
          Task Title
        </label>

        <input
          type="text"
          value={title}
          disabled={isSubmitting}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Enter task title"
          className="
          w-full
          px-4
          py-3
          border
          border-slate-300
          rounded-xl
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          mb-5
          "
          required
        />

        <label
          className="
          block
          text-sm
          font-medium
          text-slate-700
          mb-2
          "
        >
          Description
        </label>

        <textarea
          value={description}
          disabled={isSubmitting}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Describe the task..."
          rows="5"
          className="
          w-full
          px-4
          py-3
          border
          border-slate-300
          rounded-xl
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          mb-5
          "
          required
        />

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
          "
        >

          <div>

            <label
              className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
              "
            >
              Priority
            </label>

            <select
              value={priority}
              disabled={isSubmitting}
              onChange={(e) =>
                setPriority(
                  e.target.value
                )
              }
              className="
              w-full
              px-4
              py-3
              border
              border-slate-300
              rounded-xl
              "
            >
              <option value="Low">
                🟢 Low
              </option>

              <option value="Medium">
                🟡 Medium
              </option>

              <option value="High">
                🔴 High
              </option>
            </select>

          </div>

          <div>

            <label
              className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
              "
            >
              Assign To
            </label>

            <select
              value={assignedTo}
              disabled={isSubmitting}
              onChange={(e) =>
                setAssignedTo(
                  e.target.value
                )
              }
              className="
              w-full
              px-4
              py-3
              border
              border-slate-300
              rounded-xl
              "
              required
            >

              <option value="">
                Select Team Member
              </option>

              {users.map((user) => (

                <option
                  key={user._id}
                  value={user._id}
                >
                  {user.name}
                </option>

              ))}

            </select>

          </div>

        </div>

        <div className="mt-5">

          <label
            className="
            block
            text-sm
            font-medium
            text-slate-700
            mb-2
            "
          >
            Due Date & Time
          </label>

          <input
            type="datetime-local"
            value={dueDate}
            disabled={isSubmitting}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
            className="
            w-full
            px-4
            py-3
            border
            border-slate-300
            rounded-xl
            "
            required
          />

        </div>

        <div
          className="
          flex
          flex-col
          md:flex-row
          gap-3
          mt-8
          "
        >

          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setPriority("Medium");
              setAssignedTo("");
              setDueDate("");
            }}
            className="
            px-6
            py-3
            rounded-xl
            border
            border-slate-300
            hover:bg-slate-100
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            disabled:cursor-not-allowed
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            shadow-lg
            hover:shadow-xl
            transition
            "
          >
            {
              isSubmitting
                ? "⏳ Creating Task..."
                : "🚀 Create Task"
            }
          </button>

        </div>

      </form>

      {
        isSubmitting && (
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
              rounded-2xl
              shadow-xl
              text-lg
              font-semibold
              "
            >
              Creating Task...
              Please wait.
            </div>
          </div>
        )
      }

    </MainLayout>

  );
}

export default CreateTask;