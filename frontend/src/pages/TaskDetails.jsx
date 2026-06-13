import { useEffect, useState } from "react";
import { useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";
import ActivityTimeline from "../components/ActivityTimeline";

function TaskDetails() {
  const messagesContainerRef = useRef(null);
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
  const [recordingUsers, setRecordingUsers] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    fetchTask();
    fetchUsers();
    loadMessages();
    loadCurrentUser();
  }, [id]);

  useEffect(() => {
    if (!autoScroll) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, autoScroll]);

  useEffect(() => {
    fetchDiscussion();
    fetchTypingUsers();
    fetchRecordingUsers();

    const interval = setInterval(() => {
      fetchDiscussion();
      fetchTypingUsers();
      fetchRecordingUsers();
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setAutoScroll(distanceFromBottom < 150);
  };

  const fetchDiscussion = async () => {
    try {
      const res = await api.get(`/discussion/${id}`);

      setMessages((prev) => {
        if (
          prev.length === res.data.length &&
          prev[prev.length - 1]?._id === res.data[res.data.length - 1]?._id
        ) {
          return prev;
        }

        return res.data;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTypingUsers = async () => {
    try {
      const res = await api.get(`/discussion/${id}/typing`);

      setTypingUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecordingUsers = async () => {
    try {
      const res = await api.get(`/discussion/${id}/recording`);

      setRecordingUsers(res.data);
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

      await api.post(`/discussion/${id}/typing`, {
        is_typing: false,
      });

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

      await api.post(`/discussion/${id}/recording`, {
        is_recording: true,
      });

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

  const stopRecording = async () => {
    await api.post(`/discussion/${id}/recording`, {
      is_recording: false,
    });

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);

    return new Date(
      date.getTime() + 5.5 * 60 * 60 * 1000
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

        <p className="mb-4">{task.description}</p>

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

        <div className="flex gap-4 mt-8">
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

      {/* ── DISCUSSION DRAWER ── */}

      {showChatSidebar && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowChatSidebar(false)}
            className="
              fixed
              inset-0
              bg-black/40
              backdrop-blur-sm
              z-40
            "
          />

          {/* Drawer panel */}
          <div
            className="
              fixed
              top-0
              right-0
              h-[100dvh]
              w-full
              sm:w-[420px]
              bg-white
              shadow-2xl
              z-50
              flex
              flex-col
              overflow-hidden
            "
          >
            {/* ── Header ── */}
            <div
              className="
                sticky
                top-0
                z-50
                bg-white
                border-b
                px-4
                py-4
                shadow-sm
                shrink-0
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">💬 Discussion</h2>

                  {isRecording && (
                    <p className="text-red-500 text-xs animate-pulse mt-1">
                      🔴 Recording...
                    </p>
                  )}

                  {!isRecording &&
                    recordingUsers.some((u) => u !== currentUser) && (
                      <p className="text-red-500 text-xs animate-pulse mt-1">
                        🎙️ Someone is recording...
                      </p>
                    )}

                  {!isRecording &&
                    !recordingUsers.some((u) => u !== currentUser) &&
                    typingUsers.some((u) => u !== currentUser) && (
                      <p className="text-green-500 text-xs animate-pulse mt-1">
                        ✍️ Typing...
                      </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearDiscussion}
                    className="
                      px-3
                      py-2
                      text-xs
                      rounded-lg
                      bg-red-50
                      text-red-600
                      hover:bg-red-100
                      transition
                    "
                  >
                    🗑 Clear
                  </button>

                  <button
                    onClick={() => setShowChatSidebar(false)}
                    className="
                      w-9
                      h-9
                      rounded-lg
                      hover:bg-slate-100
                      flex
                      items-center
                      justify-center
                      text-slate-600
                      font-bold
                      transition
                    "
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="
                flex-1
                overflow-y-auto
                bg-slate-50
                px-3
                py-4
                pb-32
                space-y-4
              "
            >
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                  No messages yet.
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
                          max-w-[80%]
                          px-4
                          py-3
                          rounded-2xl
                          shadow-sm
                          ${
                            isMine
                              ? "bg-blue-500 text-white rounded-br-md"
                              : "bg-white text-slate-800 rounded-bl-md border border-slate-100"
                          }
                        `}
                      >
                        <div className="text-xs opacity-70 mb-1">
                          {isMine ? "You" : getUserName(msg.sender_id)}
                        </div>

                        {msg.message_type === "audio" ? (
                          <audio
                            controls
                            src={msg.audio_url}
                            className="w-56 rounded-lg"
                          />
                        ) : (
                          <div className="break-words text-sm">
                            {msg.message}
                          </div>
                        )}

                        <div className="text-[10px] opacity-70 mt-1 text-right">
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div
              className="
                sticky
                bottom-0
                border-t
                bg-white
                p-3
                shrink-0
              "
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center gap-3">
                {/* Mic button */}
                <button
                  onClick={() => {
                    if (!isRecording) {
                      startRecording();
                    } else {
                      stopRecording();
                    }
                  }}
                  className={`
                    w-11
                    h-11
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow
                    text-white
                    transition
                    shrink-0
                    ${isRecording ? "bg-red-600 animate-pulse" : "bg-red-500 hover:bg-red-600"}
                  `}
                >
                  {isRecording ? "⏹" : "🎤"}
                </button>

                {/* Text input */}
                <textarea
                  value={question}
                  onChange={async (e) => {
                    setQuestion(e.target.value);

                    await api.post(`/discussion/${id}/typing`, {
                      is_typing: true,
                    });
                  }}
                  onKeyDown={handleEnter}
                  rows={1}
                  placeholder="Type a message..."
                  className="
                    flex-1
                    border
                    border-slate-200
                    rounded-full
                    px-5
                    py-3
                    resize-none
                    focus:outline-none
                    focus:border-blue-400
                    text-sm
                    bg-slate-50
                  "
                />

                {/* Send button */}
                <button
                  onClick={sendMessage}
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    flex
                    items-center
                    justify-center
                    text-lg
                    shadow
                    transition
                    shrink-0
                  "
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default TaskDetails;