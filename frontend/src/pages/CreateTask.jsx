import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Compute completion progress
  const fields = [title, description, priority, assignedTo, dueDate];
  const filled = fields.filter(Boolean).length;
  const progress = Math.round((filled / fields.length) * 100);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const loggedInEmail = payload.email;
      const response = await api.get("/users/");
      const filteredUsers = response.data.filter(
        (user) => user.email !== loggedInEmail
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating task...");
    try {
      let uploadedAudioUrl = null;
      if (audioBlob) {
        const formData = new FormData();
        formData.append("file", audioBlob, "voice-note.webm");
        const uploadResponse = await api.post("/upload/audio", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedAudioUrl = uploadResponse.data.audio_url;
      }
      await api.post("/tasks/", {
        title,
        description,
        priority,
        assigned_to: assignedTo,
        due_date: dueDate,
        audio_url: uploadedAudioUrl,
      });
      toast.success("Task created successfully", { id: loadingToast });
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setAssignedTo("");
      setDueDate("");
      setAudioBlob(null);
      setAudioUrl("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create task", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUser = users.find((u) => u._id === assignedTo);

  const priorityConfig = {
    High: { emoji: "🔴", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
    Medium: { emoji: "🟡", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
    Low: { emoji: "🟢", color: "#10B981", bg: "#F0FDF4", border: "#A7F3D0" },
  };
  const pc = priorityConfig[priority];

  return (
    <MainLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .ct-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        /* Progress bar */
        .ct-progress-track {
          width: 100%;
          height: 6px;
          background: #E2E8F0;
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .ct-progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #6366F1 0%, #818CF8 100%);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 8px rgba(99,102,241,0.5);
        }
        .ct-progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .ct-progress-label span:first-child {
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ct-progress-label span:last-child {
          font-size: 13px;
          font-weight: 700;
          color: #6366F1;
        }

        /* Page header */
        .ct-header { margin-bottom: 28px; }
        .ct-header h1 {
          font-size: 30px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.5px;
          margin: 0 0 6px;
        }
        .ct-header p { font-size: 14px; color: #94A3B8; margin: 0; }

        /* Summary cards */
        .ct-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        @media (max-width: 640px) { .ct-summary { grid-template-columns: 1fr; } }
        .ct-summary-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px 20px;
          border: 1.5px solid #E2E8F0;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ct-summary-card:hover {
          border-color: #C7D2FE;
          box-shadow: 0 4px 16px rgba(99,102,241,0.08);
        }
        .ct-summary-card .label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94A3B8;
          margin-bottom: 8px;
        }
        .ct-summary-card .value {
          font-size: 17px;
          font-weight: 700;
          color: #0F172A;
        }

        /* Form card */
        .ct-form-card {
          background: #fff;
          border-radius: 24px;
          padding: 36px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 8px 32px rgba(15,23,42,0.06);
        }

        /* Section divider */
        .ct-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94A3B8;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #F1F5F9;
        }

        /* Field label */
        .ct-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }

        /* Inputs */
        .ct-input, .ct-textarea, .ct-select {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #0F172A;
          background: #F8FAFF;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          font-family: 'Inter', sans-serif;
        }
        .ct-input:focus, .ct-textarea:focus, .ct-select:focus {
          border-color: #6366F1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .ct-input::placeholder, .ct-textarea::placeholder { color: #CBD5E1; font-weight: 400; }
        .ct-textarea { resize: vertical; min-height: 120px; }
        .ct-select { appearance: none; cursor: pointer; }

        /* Field group */
        .ct-field { margin-bottom: 20px; }
        .ct-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) { .ct-row { grid-template-columns: 1fr; } }

        /* Voice note section */
        .ct-voice {
          background: linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%);
          border: 1.5px solid #C7D2FE;
          border-radius: 18px;
          padding: 22px;
          margin-bottom: 20px;
        }
        .ct-voice-header { margin-bottom: 14px; }
        .ct-voice-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: #3730A3;
          margin: 0 0 4px;
        }
        .ct-voice-header p { font-size: 12px; color: #818CF8; margin: 0; }
        .ct-voice-btns { display: flex; flex-wrap: wrap; gap: 10px; }

        /* Buttons */
        .ct-btn-record {
          display: flex; align-items: center; gap: 7px;
          background: #EF4444;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.1s;
          font-family: 'Inter', sans-serif;
        }
        .ct-btn-record:hover { background: #DC2626; transform: translateY(-1px); }

        .ct-btn-stop {
          display: flex; align-items: center; gap: 7px;
          background: #0F172A;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          animation: pulse-dark 1.4s ease-in-out infinite;
        }
        @keyframes pulse-dark {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }

        .ct-btn-delete {
          display: flex; align-items: center; gap: 7px;
          background: #FEE2E2;
          color: #B91C1C;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
          font-family: 'Inter', sans-serif;
        }
        .ct-btn-delete:hover { background: #FECACA; }

        .ct-recording-indicator {
          display: flex; align-items: center; gap: 8px;
          margin-top: 14px;
          font-size: 13px;
          font-weight: 600;
          color: #EF4444;
        }
        .ct-rec-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #EF4444;
          animation: blink 1s ease-in-out infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

        .ct-audio-ready {
          margin-top: 14px;
        }
        .ct-audio-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #D1FAE5;
          color: #065F46;
          font-size: 12px;
          font-weight: 600;
          border-radius: 99px;
          padding: 4px 12px;
          margin-bottom: 12px;
        }
        .ct-audio-player {
          width: 100%;
          border-radius: 8px;
          accent-color: #6366F1;
        }

        /* Priority select styled */
        .ct-select-wrapper { position: relative; }
        .ct-select-arrow {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #94A3B8;
          font-size: 12px;
        }

        /* Action buttons */
        .ct-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #F1F5F9;
        }
        .ct-btn-cancel {
          padding: 12px 24px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          background: #fff;
          font-size: 14px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          font-family: 'Inter', sans-serif;
        }
        .ct-btn-cancel:hover { background: #F8FAFF; border-color: #CBD5E1; }
        .ct-btn-submit {
          flex: 1;
          padding: 13px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.1s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.01em;
        }
        .ct-btn-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .ct-btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Overlay */
        .ct-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50;
        }
        .ct-overlay-card {
          background: #fff;
          border-radius: 20px;
          padding: 36px 48px;
          text-align: center;
          box-shadow: 0 24px 64px rgba(15,23,42,0.2);
        }
        .ct-overlay-spinner {
          width: 40px; height: 40px;
          border: 3px solid #E2E8F0;
          border-top-color: #6366F1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ct-overlay-card p {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px;
        }
        .ct-overlay-card span {
          font-size: 13px;
          color: #94A3B8;
        }
      `}</style>

      <div className="ct-root">
        {/* Header */}
        <div className="ct-header">
          <h1>Create New Task</h1>
          <p>
            Assign focused work to the right person, with the right context.
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="ct-progress-label">
            <span>Task Completion</span>
            <span>{progress}%</span>
          </div>
          <div className="ct-progress-track">
            <div
              className="ct-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="ct-summary">
          <div
            className="ct-summary-card"
            style={{ borderColor: pc.border, background: pc.bg }}
          >
            <div className="label">Priority</div>
            <div className="value" style={{ color: pc.color }}>
              {pc.emoji} {priority}
            </div>
          </div>

          <div className="ct-summary-card">
            <div className="label">Assignee</div>
            <div className="value">
              {selectedUser ? `👤 ${selectedUser.name}` : "Not Selected"}
            </div>
          </div>

          <div className="ct-summary-card">
            <div className="label">Due Date</div>
            <div className="value">
              {dueDate
                ? `📅 ${new Date(dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : "Not Set"}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="ct-form-card">
          <form onSubmit={handleSubmit}>
            <div className="ct-section-label">Task Details</div>

            <div className="ct-field">
              <label className="ct-label">Task Title</label>
              <input
                type="text"
                className="ct-input"
                value={title}
                disabled={isSubmitting}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design the onboarding flow"
                required
              />
            </div>

            <div className="ct-field">
              <label className="ct-label">Description</label>
              <textarea
                className="ct-textarea"
                value={description}
                disabled={isSubmitting}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What needs to be done, and why it matters..."
                rows="4"
                required
              />
            </div>

            {/* Voice Note */}
            <div className="ct-voice">
              <div className="ct-voice-header">
                <h3>🎤 Voice Note</h3>
                <p>Leave an audio briefing for the assignee</p>
              </div>
              <div className="ct-voice-btns">
                {!isRecording && (
                  <button
                    type="button"
                    className="ct-btn-record"
                    onClick={startRecording}
                  >
                    🎙 Start Recording
                  </button>
                )}
                {isRecording && (
                  <button
                    type="button"
                    className="ct-btn-stop"
                    onClick={stopRecording}
                  >
                    ⏹ Stop Recording
                  </button>
                )}
                {audioUrl && (
                  <button
                    type="button"
                    className="ct-btn-delete"
                    onClick={deleteRecording}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
              {isRecording && (
                <div className="ct-recording-indicator">
                  <span className="ct-rec-dot" />
                  Recording in progress…
                </div>
              )}
              {audioUrl && (
                <div className="ct-audio-ready">
                  <div className="ct-audio-badge">✅ Recording ready</div>
                  <audio controls src={audioUrl} className="ct-audio-player" />
                </div>
              )}
            </div>

            <div className="ct-section-label">Assignment</div>

            <div className="ct-row" style={{ marginBottom: 20 }}>
              <div>
                <label className="ct-label">Priority</label>
                <div className="ct-select-wrapper">
                  <select
                    className="ct-select"
                    value={priority}
                    disabled={isSubmitting}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                  <span className="ct-select-arrow">▾</span>
                </div>
              </div>

              <div>
                <label className="ct-label">Assign To</label>
                <div className="ct-select-wrapper">
                  <select
                    className="ct-select"
                    value={assignedTo}
                    disabled={isSubmitting}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                  >
                    <option value="">Select Team Member</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <span className="ct-select-arrow">▾</span>
                </div>
              </div>
            </div>

            <div className="ct-field">
              <label className="ct-label">Due Date & Time</label>

              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                timeIntervals={1}
                dateFormat="dd/MM/yyyy hh:mm aa"
                className="ct-input"
                placeholderText="Select Due Date"
                required
              />
            </div>

            <div className="ct-actions">
              <button
                type="button"
                className="ct-btn-cancel"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setPriority("Medium");
                  setAssignedTo("");
                  setDueDate("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ct-btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "⏳ Creating…" : "🚀 Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isSubmitting && (
        <div className="ct-overlay">
          <div className="ct-overlay-card">
            <div className="ct-overlay-spinner" />
            <p>Creating your task…</p>
            <span>Hang tight, almost done</span>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default CreateTask;
