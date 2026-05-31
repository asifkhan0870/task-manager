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

  return (

    <MainLayout>

      <h1
        className="
        text-4xl
        font-bold
        mb-8
      "
      >
        Create Task
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        p-8
        rounded-xl
        shadow
        max-w-2xl
      "
      >

        <input
          type="text"
          placeholder="Title"
          value={title}
          disabled={isSubmitting}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="
          w-full
          border
          p-3
          mb-4
          rounded
        "
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          disabled={isSubmitting}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="
          w-full
          border
          p-3
          mb-4
          rounded
        "
          rows="4"
          required
        />

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
          border
          p-3
          mb-4
          rounded
        "
        >
          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
        </select>

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
          border
          p-3
          mb-4
          rounded
        "
          required
        >
          <option value="">
            Assign to
          </option>

          {users.map((user) => (

            <option
              key={user._id}
              value={user._id}
            >
              {user.name
                ? `${user.name} - ${user.email}`
                : user.email}
            </option>

          ))}
        </select>

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
          border
          p-3
          mb-4
          rounded
        "
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            text-white
            px-6
            py-3
            rounded
            transition
            ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {
            isSubmitting
              ? "Creating Task..."
              : "Create Task"
          }
        </button>

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
              rounded-xl
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