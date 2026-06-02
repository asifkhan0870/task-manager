import { useEffect, useState } from "react";
import { useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";
import ActivityTimeline from "../components/ActivityTimeline";

function TaskDetails() {
  const messagesEndRef = useRef(null);
  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);

  const [loadingAction, setLoadingAction] = useState("");
  const [showChatSidebar, setShowChatSidebar] = useState(false);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);

 
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    fetchTask();
    fetchUsers();
    loadMessages();
    loadCurrentUser();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    fetchDiscussion();
    fetchTypingUsers();
  
    const interval = setInterval(() => {
      fetchDiscussion();
      fetchTypingUsers();
    }, 1000);
  
    return () => clearInterval(interval);
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      const res = await api.get(
        `/discussion/${id}`
      );
  
      setMessages(
        res.data
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTypingUsers = async () => {
    try {
  
      const res = await api.get(
        `/discussion/${id}/typing`
      );
  
      setTypingUsers(
        res.data
      );
  
    } catch (err) {
      console.log(err);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const response = await api.get("/me");

      setCurrentUser(response.data.user_id);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.get(`/discussion/${id}`);

      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!question.trim()) {
      return;
    }

    try {
      await api.post(`/discussion/${id}/message`, {
        message: question,
      });

      setQuestion("");

      await api.post(
        `/discussion/${id}/typing`,
        {
          is_typing: false
        }
      );

      await loadMessages();
    } catch (error) {
      console.error(error);

      toast.error("Failed to send message");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, {
          type: "audio/webm",
        });

        await uploadAudio(audioBlob);
      };

      recorder.start();

      setMediaRecorder(recorder);

      setIsRecording(true);
    } catch (err) {
      console.error(err);

      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();

    setIsRecording(false);
  };

  const uploadAudio = async (audioBlob) => {
    try {
      const formData = new FormData();

      formData.append("file", audioBlob, "voice.webm");

      const response = await api.post("/upload/audio", formData);

      await api.post(`/discussion/${id}/message`, {
        audio_url: response.data.audio_url,
        message: "",
      });

      await loadMessages();

      console.log(response.data.audio_url);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/id/${id}`);

      setTask(response.data);
    } catch (err) {
      console.log(err);

      toast.error("Failed to load task");
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u._id === userId);

    return user ? user.name : userId;
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");

      setUsers(response.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async () => {
    if (loadingAction) return;

    const confirmDelete = window.confirm("Delete this task?");

    if (!confirmDelete) return;

    setLoadingAction("delete");

    const loadingToast = toast.loading("Deleting task...");

    try {
      await api.delete(`/tasks/id/${id}`);

      toast.success("Task deleted successfully", {
        id: loadingToast,
      });

      navigate("/tasks");
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete task", {
        id: loadingToast,
      });
    } finally {
      setLoadingAction("");
    }
  };

  const updateStatus = async (status) => {
    if (loadingAction) return;

    setLoadingAction(status);

    const loadingToast = toast.loading(`Updating status...`);

    try {
      await api.patch(`/tasks/id/${id}/status`, {
        status,
      });

      await fetchTask();

      toast.success(`Status updated to ${status}`, {
        id: loadingToast,
      });
    } catch (err) {
      console.log(err);

      toast.error("Failed to update status", {
        id: loadingToast,
      });
    } finally {
      setLoadingAction("");
    }
  };

  const clearDiscussion = async () => {
    const confirmed = window.confirm("Clear entire discussion?");

    if (!confirmed) return;

    try {
      await api.delete(`/discussion/${id}`);

      setMessages([]);

      toast.success("Discussion cleared");
    } catch (error) {
      toast.error("Failed");
    }
  };

  const handleEnter = (e) => {
    if (e.key !== "Enter" || e.shiftKey) {
      return;
    }

    e.preventDefault();

    if (isRecording) {
      stopRecording();
    } else {
      sendMessage();
    }
  };

  if (!task) return <MainLayout>Loading...</MainLayout>;

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

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowChatSidebar(true)}
            className="
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-4
      py-2
      rounded-xl
      shadow-md
      transition
    "
          >
            💬 Discussion
          </button>
        </div>

        <p
          className="
            mb-4
            "
        >
          {task.description}
        </p>

        {task.audio_url && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">🎤 Voice Note</h3>

            <audio controls src={task.audio_url} className="w-full" />

            <a
              href={task.audio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="
        inline-block
        mt-2
        text-blue-600
        hover:underline
      "
            >
              Open Audio in New Tab
            </a>
          </div>
        )}

        <p>
          <b>Priority:</b> {task.priority}
        </p>

        <p>
          <b>Status:</b> {task.status}
        </p>

        <p>
          <b>Assigned By:</b> {getUserName(task.assigned_by)}
        </p>

        <p>
          <b>Assigned To:</b> {getUserName(task.assigned_to)}
        </p>

        <p>
          <b>Due Date:</b>{" "}
          {new Date(task.due_date).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>

        <div
          className="
            flex
            gap-4
            mt-8
            "
        >
          <button
            disabled={!!loadingAction}
            onClick={() => updateStatus("In Progress")}
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
            {loadingAction === "In Progress" ? "Updating..." : "In Progress"}
          </button>

          <button
            disabled={!!loadingAction}
            onClick={() => updateStatus("Done")}
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
            {loadingAction === "Done" ? "Updating..." : "Mark Done"}
          </button>

          <button
            disabled={!!loadingAction}
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
            {loadingAction === "delete" ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <ActivityTimeline taskId={id} />

      {loadingAction && (
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
            Processing... Please wait.
          </div>
        </div>
      )}

      {/* CHAT SIDEBAR */}

      {showChatSidebar && (
        <div
          className="
       fixed
       top-0
       right-0
       h-screen
     
       w-full
       md:w-[450px]
     
       bg-white
       shadow-2xl
       z-50
       flex
       flex-col
       border-l
     "
        >
          {/* Header */}

          <div
            className="
    p-5
    border-b
    flex
    justify-between
    items-center
  "
          >
            <div>
              <h2 className="text-lg md:text-xl font-bold">💬 Discussion</h2>
              {typingUsers.length > 0 && (
  <p
    className="
      text-green-500
      text-xs
      animate-pulse
      mt-1
    "
  >
    Someone is typing...
  </p>
)}
              <p className="text-xs text-slate-400">{task.title}</p>
              {/* <p className="text-sm text-slate-500">Task Clarifications</p> */}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearDiscussion}
                className="
    bg-red-50
    text-red-600
    px-3
    py-1
    rounded-lg
    text-xs
    font-medium
    hover:bg-red-100
  "
              >
                🗑 Clear
              </button>

              <button
                onClick={() => setShowChatSidebar(false)}
                className="
        text-xl
        hover:text-red-500
      "
              >
                ✖
              </button>
            </div>
          </div>

          {/* Messages */}

          <div
            className="
        flex-1
        overflow-y-auto
        p-4
        space-y-3
      "
          >
            <div
              className="
    flex-1
    overflow-y-auto
    p-4
    space-y-4
    bg-slate-50
    pb-28
  "
            >
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                  No discussion yet.
                  <br />
                  Start the conversation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === currentUser;

                  return (
                    <div
                      key={msg._id}
                      className={`
          flex
          ${isMine ? "justify-end" : "justify-start"}
        `}
                    >
                      <div
                        className={`
            max-w-[85%] md:max-w-[75%]
            px-4
            py-3
            rounded-2xl
            shadow-sm

            ${
              isMine
                ? `
                  bg-blue-500
                  text-white
                  rounded-br-md
                `
                : `
                  bg-slate-100
                  text-slate-800
                  rounded-bl-md
                `
            }
          `}
                      >
                        <div
                          className="
              text-xs
              opacity-70
              mb-1
            "
                        >
                          {isMine ? "You" : getUserName(msg.sender_id)}
                        </div>

                        <>
  {msg.message_type === "audio" ? (
    <audio
      controls
      src={msg.audio_url}
      className="
        w-56
        rounded-lg
      "
    />
  ) : (
    <div
      className="
        break-words
        text-sm
      "
    >
      {msg.message}
    </div>
  )}

  <div
    className="
      text-[10px]
      opacity-70
      mt-1
    "
  >
    {new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>
</>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef}></div>
            </div>
          </div>

          {isRecording && (
            <div
              className="
      text-red-500
      text-sm
      font-semibold
      animate-pulse
      mb-2
    "
            >
              🔴 Recording...
            </div>
          )}

          {/* Message Input */}

          <div
            className="
    border-t
    p-3
    bg-white

    sticky
    bottom-0
    z-10
  "
          >
            <div
              className="
      flex
      items-center
      gap-3
    "
            >
              {/* MIC */}

              <button
                onClick={() => {
                  if (!isRecording) {
                    startRecording();
                  } else {
                    stopRecording();
                  }
                }}
                className="
    w-12
    h-12
    rounded-full
    bg-red-500
    text-white
    flex
    items-center
    justify-center
    shadow
  "
              >
                {isRecording ? "⏹" : "🎤"}
              </button>

              {/* INPUT */}

              <textarea
                value={question}
                onChange={async (e) => {

  setQuestion(
    e.target.value
  );

  await api.post(
    `/discussion/${id}/typing`,
    {
      is_typing: true
    }
  );

}}
                onKeyDown={handleEnter}
                rows={1}
                placeholder="Type a message..."
                className="
        flex-1
        border
        rounded-full
        px-5
        py-3
        resize-none
        focus:outline-none
      "
              />

              {/* SEND */}

              <button
                onClick={sendMessage}
                className="
        w-12
        h-12
        rounded-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        flex
        items-center
        justify-center
        text-xl
        shadow
      "
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default TaskDetails;
