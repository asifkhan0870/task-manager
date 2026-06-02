import { Link } from "react-router-dom";

function TaskCard({ task }) {
  return (
    <Link
      to={`/tasks/${task._id}`}
      className="
      block
      bg-white
      rounded-2xl
      shadow-md
      border
      border-slate-200
      p-5
      hover:shadow-lg
      transition
      "
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-slate-800">
          {task.title}
        </h3>

        {task.audio_url && (
          <span
            className="
            bg-blue-100
            text-blue-700
            text-xs
            font-medium
            px-2
            py-1
            rounded-full
            "
          >
            🎤 Voice Note
          </span>
        )}
      </div>

      <p className="text-slate-500 mt-2 line-clamp-2">
        {task.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span
          className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${
              task.priority === "High"
                ? "bg-red-100 text-red-600"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }
          `}
        >
          {task.priority}
        </span>

        <span className="text-sm text-slate-500">
          {task.status}
        </span>
      </div>
    </Link>
  );
}

export default TaskCard;