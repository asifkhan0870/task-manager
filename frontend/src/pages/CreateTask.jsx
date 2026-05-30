import { useState, useEffect } from "react";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

function CreateTask() {

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [
    assignedTo,
    setAssignedTo
  ] = useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const payload =
          JSON.parse(
            atob(
              token.split(".")[1]
            )
          );

        const loggedInEmail =
          payload.email;

        const response =
          await api.get(
            "/users/"
          );

        const filteredUsers =
          response.data.filter(
            (user) =>
              user.email !==
              loggedInEmail
          );

        setUsers(
          filteredUsers
        );

      } catch (err) {

        console.log(err);
      }
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

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

        alert(
          "Task Created Successfully"
        );

        setTitle("");
        setDescription("");
        setPriority("Medium");
        setAssignedTo("");
        setDueDate("");

      } catch (err) {

        console.log(err);

        alert(
          "Error Creating Task"
        );
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
          onChange={(e) =>
            setTitle(
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

        <textarea
          placeholder="Description"
          value={description}
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
          className="
          bg-blue-600
          text-white
          px-6
          py-3
          rounded
          hover:bg-blue-700
          transition
          "
        >
          Create Task
        </button>

      </form>

    </MainLayout>

  );
}

export default CreateTask;