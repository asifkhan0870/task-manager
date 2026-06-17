import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import ActivityTimeline from "../components/ActivityTimeline";


function TaskDetails() {
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
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
    if (searchParams.get("discussion") === "true") {
      setShowChatSidebar(true);
      markNotificationsRead();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!autoScroll) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, autoScroll]);

  useEffect(() => {
    if (!showChatSidebar) return;

    fetchDiscussion();
    fetchTypingUsers();
    fetchRecordingUsers();

    const interval = setInterval(() => {
      fetchDiscussion();
      fetchTypingUsers();
      fetchRecordingUsers();
    }, 3000);

    return () => clearInterval(interval);
  }, [id, showChatSidebar]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setAutoScroll(distanceFromBottom < 150);
  };

  const markNotificationsRead = async () => {
    try {
      await api.patch(`/notifications/task/${id}/read`);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDiscussion = async () => {
    try {
      const res = await api.get(`/discussion/${id}`);
      setMessages((prev) => {
        if (
          prev.length === res.data.length &&
          prev[prev.length - 1]?._id === res.data[res.data.length - 1]?._id
        )
          return prev;
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
    if (!question.trim()) return;
    try {
      await api.post(`/discussion/${id}/message`, { message: question });
      setQuestion("");
      await api.post(`/discussion/${id}/typing`, { is_typing: false });
      await loadMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      await api.post(`/discussion/${id}/recording`, { is_recording: true });
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
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
    await api.post(`/discussion/${id}/recording`, { is_recording: false });
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
      toast.success("Task deleted successfully", { id: loadingToast });
      navigate("/tasks");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete task", { id: loadingToast });
    } finally {
      setLoadingAction("");
    }
  };

  const updateStatus = async (status) => {
    if (loadingAction) return;
    setLoadingAction(status);
    const loadingToast = toast.loading("Updating status...");
    try {
      await api.patch(`/tasks/id/${id}/status`, { status });
      await fetchTask();
      toast.success(`Status updated to ${status}`, { id: loadingToast });
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status", { id: loadingToast });
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
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    if (isRecording) stopRecording();
    else sendMessage();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + 5.5 * 60 * 60 * 1000).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  const priorityConfig = {
    High: { color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", emoji: "🔴" },
    Medium: { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", emoji: "🟡" },
    Low: { color: "#10B981", bg: "#F0FDF4", border: "#A7F3D0", emoji: "🟢" },
  };

  const statusConfig = {
    Incomplete: {
      color: "#64748B",
      bg: "#F1F5F9",
      border: "#E2E8F0",
      emoji: "⏳",
    },
    "In Progress": {
      color: "#F59E0B",
      bg: "#FFFBEB",
      border: "#FDE68A",
      emoji: "🔄",
    },
    Done: { color: "#10B981", bg: "#F0FDF4", border: "#A7F3D0", emoji: "✅" },
  };

  const pc = priorityConfig[task?.priority] || priorityConfig["Medium"];
  const sc = statusConfig[task?.status] || statusConfig["Incomplete"];

  if (!task)
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            fontFamily: "Inter, sans-serif",
            color: "#94A3B8",
            fontSize: 15,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #E2E8F0",
                borderTopColor: "#6366F1",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Loading task…
          </div>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .td-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.2} }
        @keyframes pulse-soft { 0%,100%{opacity:1}50%{opacity:0.6} }
        @keyframes slideIn { from{transform:translateX(100%)}to{transform:translateX(0)} }

        /* Header */
.td-header {
  margin-top: 60px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

   
@media (max-width: 640px) {
  .td-header {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .td-header > div {
    flex: 1;
    min-width: 0;
  }

  .td-title {
    font-size: 18px;
    line-height: 1.2;
  }

  .td-btn-discussion {
    padding: 8px 10px;
    font-size: 12px;
    flex-shrink: 0;
  }
}

  .td-title {
  font-size: 28px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
}
        .td-subtitle { font-size: 13px; color: #94A3B8; margin: 0; }

        /* FIX 1 — Restore old header layout on mobile: button stays on the right */
  

        /* Discussion btn */
        .td-btn-discussion {
          display: inline-flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
          color: #fff; border: none; border-radius: 12px;
          padding: 11px 20px; font-size: 14px; font-weight: 600;
          cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: opacity 0.18s, transform 0.1s;
          font-family: 'Inter', sans-serif; white-space: nowrap;
        }
        .td-btn-discussion:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Stat pills row */
        .td-stats { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .td-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 99px; border: 1.5px solid;
          font-size: 13px; font-weight: 600;
        }

        /* Main card */
        .td-card {
          background: #fff; border-radius: 24px; padding: 32px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 8px 32px rgba(15,23,42,0.06);
          margin-bottom: 20px;
        }

        /* Description block */
        .td-desc {
          background: #F8FAFF; border: 1.5px solid #E2E8F0;
          border-radius: 14px; padding: 18px 20px;
          font-size: 15px; color: #334155; line-height: 1.65;
          margin-bottom: 24px;
        }

        /* Voice note */
        .td-voice {
          background: linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%);
          border: 1.5px solid #C7D2FE; border-radius: 18px;
          padding: 20px; margin-bottom: 24px;
        }
        .td-voice h3 { font-size: 14px; font-weight: 700; color: #3730A3; margin: 0 0 12px; }
        .td-voice audio { width: 100%; accent-color: #6366F1; border-radius: 8px; }
        .td-voice a {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 10px; font-size: 12px; font-weight: 600;
          color: #6366F1; text-decoration: none;
        }
        .td-voice a:hover { text-decoration: underline; }

        /* Meta info grid */
        .td-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        @media (max-width: 560px) { .td-meta { grid-template-columns: 1fr; } }
        .td-meta-item {
          background: #F8FAFF; border: 1.5px solid #E2E8F0;
          border-radius: 12px; padding: 14px 16px;
        }
        .td-meta-item .label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94A3B8; margin-bottom: 5px; }
        .td-meta-item .value { font-size: 14px; font-weight: 600; color: #0F172A; }

        /* Section label */
        .td-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #94A3B8;
          margin-bottom: 16px; padding-bottom: 10px;
          border-bottom: 1px solid #F1F5F9;
        }

        /* Action buttons */
        .td-actions { display: flex; gap: 10px; flex-wrap: nowrap; padding-top: 24px; border-top: 1px solid #F1F5F9; }
        .td-btn-inprogress {
          flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: #FFFBEB; color: #92400E; border: 1.5px solid #FDE68A;
          border-radius: 12px; padding: 11px 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.18s; font-family: 'Inter', sans-serif;
        }
        .td-btn-inprogress:hover:not(:disabled) { background: #FEF3C7; }
        .td-btn-done {
          flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: #F0FDF4; color: #065F46; border: 1.5px solid #A7F3D0;
          border-radius: 12px; padding: 11px 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.18s; font-family: 'Inter', sans-serif;
        }
        .td-btn-done:hover:not(:disabled) { background: #D1FAE5; }
        .td-btn-delete {
          flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: #FEF2F2; color: #B91C1C; border: 1.5px solid #FECACA;
          border-radius: 12px; padding: 11px 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.18s; font-family: 'Inter', sans-serif;
        }
        .td-btn-delete:hover:not(:disabled) { background: #FEE2E2; }
        .td-btn-disabled { opacity: 0.5; cursor: not-allowed !important; }

        @media (max-width: 640px) {
          .td-actions { gap: 8px; }
          .td-btn-inprogress,
          .td-btn-done,
          .td-btn-delete {
            font-size: 12px;
            padding: 10px 6px;
            white-space: nowrap;
          }
        }

        /* Overlay */
        .td-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.5);
          backdrop-filter: blur(4px); display: flex; align-items: center;
          justify-content: center; z-index: 50;
        }
        .td-overlay-card { background: #fff; border-radius: 20px; padding: 36px 48px; text-align: center; box-shadow: 0 24px 64px rgba(15,23,42,0.2); }
        .td-overlay-spinner { width: 40px; height: 40px; border: 3px solid #E2E8F0; border-top-color: #6366F1; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 16px; }
        .td-overlay-card p { font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 4px; }
        .td-overlay-card span { font-size: 13px; color: #94A3B8; }

        /* ── DRAWER ── */
        .td-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); z-index: 40; }

        @media (max-width: 640px) {

  .td-drawer {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    max-width: 100vw;
    border-radius: 0;
    transform: none;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .td-drawer-header {
    padding-top: calc(
      14px + env(safe-area-inset-top)
    );
  }

  .td-messages {
    width: 100%;
    overflow-x: hidden;
  }
}

        /* FIX 2 — Discussion modal goes true full-screen on mobile */
        @media (max-width: 640px) {
          .td-drawer {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100dvh;
            border-radius: 0;
            transform: none;
          }
          .td-btn-clear {
            padding: 6px 10px;
            font-size: 11px;
          }
          .td-btn-close {
            width: 32px;
            height: 32px;
          }
          .td-btn-send,
          .td-btn-mic {
            width: 42px;
            height: 42px;
          }
        }

   .td-drawer {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  background: #fff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.25s ease;
}

        .td-drawer-header {
          background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .td-drawer-header-left h2 {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
        }

        .td-drawer-status { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.75); animation: pulse-soft 1.4s ease-in-out infinite; }
        .td-drawer-header-right { display: flex; align-items: center; gap: 8px; }
        .td-btn-clear {
          background: rgba(255,255,255,0.15); color: #fff; border: none;
          border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background 0.18s; font-family: 'Inter', sans-serif;
        }
        .td-btn-clear:hover { background: rgba(255,255,255,0.25); }
        .td-btn-close {
          width: 34px; height: 34px; border-radius: 8px; border: none;
          background: rgba(255,255,255,0.15); color: #fff; font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.18s; font-family: 'Inter', sans-serif;
        }
        .td-btn-close:hover { background: rgba(255,255,255,0.25); }

        .td-messages {
          flex: 1;
          overflow-y: auto;
          background: #F8FAFF;
          padding: 16px;
        }

        @media (max-width: 640px) {
          .td-messages { padding: 12px; }
        }

        .td-empty { text-align: center; color: #94A3B8; margin-top: 60px; font-size: 14px; line-height: 1.6; }
        .td-msg-row { display: flex; }
        .td-msg-row.mine { justify-content: flex-end; }
        .td-msg-row.theirs { justify-content: flex-start; }

        .td-bubble {
          max-width: 80%;
          padding: 12px 14px;
          border-radius: 16px;
          margin-bottom: 10px;
        }

        @media (max-width: 640px) {
          .td-bubble { max-width: 88%; }
        }

        .td-bubble.mine { background: linear-gradient(135deg, #6366F1, #818CF8); color: #fff; border-bottom-right-radius: 4px; }
        .td-bubble.theirs { background: #fff; color: #0F172A; border: 1.5px solid #E2E8F0; border-bottom-left-radius: 4px; }
        .td-bubble-sender { font-size: 11px; font-weight: 600; margin-bottom: 4px; opacity: 0.75; }
        .td-bubble-text { font-size: 14px; line-height: 1.45; word-break: break-word; }
        .td-bubble-time { font-size: 10px; opacity: 0.6; margin-top: 4px; text-align: right; }
        .td-bubble audio { width: 200px; border-radius: 8px; accent-color: #6366F1; }

        .td-input-area {
          border-top: 1.5px solid #E2E8F0; background: #fff;
          padding: 12px 14px; padding-bottom: calc(12px + env(safe-area-inset-bottom));
          flex-shrink: 0;
        }
        .td-input-row { display: flex; align-items: center; gap: 10px; }
        .td-btn-mic {
          width: 44px; height: 44px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; cursor: pointer; transition: background 0.18s, transform 0.1s;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .td-btn-mic.idle { background: #EF4444; }
        .td-btn-mic.idle:hover { background: #DC2626; transform: scale(1.05); }
        .td-btn-mic.recording { background: #0F172A; animation: pulse-soft 1s ease-in-out infinite; }
        .td-msg-input {
          flex: 1; border: 1.5px solid #E2E8F0; border-radius: 24px;
          padding: 11px 18px; font-size: 14px; resize: none;
          outline: none; background: #F8FAFF; transition: border-color 0.18s;
          font-family: 'Inter', sans-serif; color: #0F172A;
        }
        .td-msg-input:focus { border-color: #6366F1; background: #fff; }
        .td-msg-input::placeholder { color: #CBD5E1; }
        .td-btn-send {
          width: 44px; height: 44px; border-radius: 50%; border: none;
          background: linear-gradient(135deg, #6366F1, #818CF8); color: #fff;
          font-size: 18px; cursor: pointer; display: flex; align-items: center;
          justify-content: center; box-shadow: 0 4px 12px rgba(99,102,241,0.4);
          transition: opacity 0.18s, transform 0.1s; flex-shrink: 0;
        }
        .td-btn-send:hover { opacity: 0.9; transform: scale(1.05); }
      `}</style>

<div className="td-root">
        {/* Header */}
        <div className="td-header">
          <div>
            <h1 className="td-title">{task.title}</h1>
            <p className="td-subtitle">Task #{id.slice(-8).toUpperCase()}</p>
          </div>
          <button
            className="td-btn-discussion"
            onClick={() => setShowChatSidebar(true)}
          >
            💬 Discussion
          </button>
        </div>

        {/* Status & Priority pills */}
        <div className="td-stats">
          <span
            className="td-pill"
            style={{ color: pc.color, background: pc.bg, borderColor: pc.border }}
          >
            {pc.emoji} {task.priority} Priority
          </span>
          <span
            className="td-pill"
            style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}
          >
            {sc.emoji} {task.status}
          </span>
        </div>

        {/* Main card */}
        <div className="td-card">
          <div className="td-section-label">Description</div>
          <div className="td-desc">{task.description}</div>

          {/* Voice Note */}
          {task.audio_url && (
            <>
              <div className="td-section-label">Voice Note</div>
              <div className="td-voice">
                <h3>🎤 Attached Voice Note</h3>
                <audio controls src={task.audio_url} />
                <a href={task.audio_url} target="_blank" rel="noopener noreferrer">
                  ↗ Open in new tab
                </a>
              </div>
            </>
          )}

          {/* Meta grid */}
          <div className="td-section-label" style={{ marginTop: 4 }}>
            Task Info
          </div>
          <div className="td-meta">
            <div className="td-meta-item">
              <div className="label">Assigned By</div>
              <div className="value">👤 {getUserName(task.assigned_by)}</div>
            </div>
            <div className="td-meta-item">
              <div className="label">Assigned To</div>
              <div className="value">👤 {getUserName(task.assigned_to)}</div>
            </div>
            <div className="td-meta-item" style={{ gridColumn: "1 / -1" }}>
              <div className="label">Due Date</div>
              <div className="value">
                📅{" "}
                {new Date(
                  new Date(task.due_date).getTime() + 5.5 * 60 * 60 * 1000
                ).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="td-section-label">Update Status</div>
          <div className="td-actions">
            <button
              className={`td-btn-inprogress ${loadingAction ? "td-btn-disabled" : ""}`}
              disabled={!!loadingAction}
              onClick={() => updateStatus("In Progress")}
            >
              {loadingAction === "In Progress" ? "⏳ Updating…" : "🔄 In Progress"}
            </button>
            <button
              className={`td-btn-done ${loadingAction ? "td-btn-disabled" : ""}`}
              disabled={!!loadingAction}
              onClick={() => updateStatus("Done")}
            >
              {loadingAction === "Done" ? "⏳ Updating…" : "✅ Mark Done"}
            </button>
            <button
              className={`td-btn-delete ${loadingAction ? "td-btn-disabled" : ""}`}
              disabled={!!loadingAction}
              onClick={deleteTask}
            >
              {loadingAction === "delete" ? "⏳ Deleting…" : "🗑 Delete"}
            </button>
          </div>
        </div>

        <ActivityTimeline taskId={id} />
      </div>

      {/* Loading overlay */}
      {loadingAction && (
        <div className="td-overlay">
          <div className="td-overlay-card">
            <div className="td-overlay-spinner" />
            <p>Processing…</p>
            <span>Please wait a moment</span>
          </div>
        </div>
      )}

      {/* Discussion Drawer */}
      {showChatSidebar && (
        <>
          <div className="td-backdrop" onClick={() => setShowChatSidebar(false)} />
          <div className="td-drawer">
            {/* Drawer header */}
            <div className="td-drawer-header">
              <div className="td-drawer-header-left">
                <h2>💬 Discussion</h2>
                {isRecording && (
                  <div className="td-drawer-status">🔴 Recording…</div>
                )}
                {!isRecording && recordingUsers.some((u) => u !== currentUser) && (
                  <div className="td-drawer-status">🎙️ Someone is recording…</div>
                )}
                {!isRecording &&
                  !recordingUsers.some((u) => u !== currentUser) &&
                  typingUsers.some((u) => u !== currentUser) && (
                    <div className="td-drawer-status">✍️ Typing…</div>
                  )}
              </div>
              <div className="td-drawer-header-right">
                <button className="td-btn-clear" onClick={clearDiscussion}>
                  🗑 Clear
                </button>
                <button className="td-btn-close" onClick={() => setShowChatSidebar(false)}>
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="td-messages"
              ref={messagesContainerRef}
              onScroll={handleScroll}
            >
              {messages.length === 0 ? (
                <div className="td-empty">
                  No messages yet.
                  <br />
                  Be the first to say something! 👋
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === currentUser;
                  return (
                    <div
                      key={msg._id}
                      className={`td-msg-row ${isMine ? "mine" : "theirs"}`}
                    >
                      <div className={`td-bubble ${isMine ? "mine" : "theirs"}`}>
                        <div className="td-bubble-sender">
                          {isMine ? "You" : getUserName(msg.sender_id)}
                        </div>
                        {msg.message_type === "audio" ? (
                          <audio controls src={msg.audio_url} />
                        ) : (
                          <div className="td-bubble-text">{msg.message}</div>
                        )}
                        <div className="td-bubble-time">
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="td-input-area">
              <div className="td-input-row">
                <button
                  className={`td-btn-mic ${isRecording ? "recording" : "idle"}`}
                  onClick={() => {
                    if (!isRecording) startRecording();
                    else stopRecording();
                  }}
                >
                  {isRecording ? "⏹" : "🎤"}
                </button>
                <textarea
                  className="td-msg-input"
                  value={question}
                  rows={1}
                  placeholder="Type a message…"
                  onChange={async (e) => {
                    setQuestion(e.target.value);
                    await api.post(`/discussion/${id}/typing`, { is_typing: true });
                  }}
                  onKeyDown={handleEnter}
                />
                <button className="td-btn-send" onClick={sendMessage}>
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