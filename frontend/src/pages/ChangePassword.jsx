import { useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );

      toast.success(
        "Password changed successfully"
      );

      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      relative
      min-h-screen
      overflow-hidden
      flex
      items-center
      justify-center
      px-4
      bg-slate-950
      "
    >
      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="
          absolute
          top-[-150px]
          left-[-150px]
          w-[400px]
          h-[400px]
          bg-blue-600/30
          blur-3xl
          rounded-full
          animate-pulse
          "
        />

        <div
          className="
          absolute
          bottom-[-180px]
          right-[-180px]
          w-[450px]
          h-[450px]
          bg-cyan-500/20
          blur-3xl
          rounded-full
          animate-pulse
          "
        />

        <div
          className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[500px]
          h-[500px]
          bg-indigo-500/10
          blur-3xl
          rounded-full
          "
        />
      </div>

      {/* Card */}

      <div
        className="
        relative
        z-10
        w-full
        max-w-md
        backdrop-blur-xl
        bg-white/10
        border
        border-white/20
        rounded-3xl
        shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        p-8
        md:p-10
        "
      >
        <div className="text-center mb-8">

          <div
            className="
            mx-auto
            w-20
            h-20
            rounded-2xl
            bg-gradient-to-r
            from-blue-500
            to-cyan-500
            flex
            items-center
            justify-center
            shadow-lg
            "
          >
            <ShieldCheck
              size={40}
              className="text-white"
            />
          </div>

          <h1
            className="
            text-white
            text-4xl
            font-bold
            mt-5
            "
          >
            Change Password
          </h1>

          <p
            className="
            text-slate-300
            mt-2
            "
          >
            Update your account security
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            required
            className="
            w-full
            mb-4
            bg-white/10
            border
            border-white/20
            text-white
            placeholder:text-slate-400
            rounded-xl
            px-4
            py-3
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/30
            "
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
            className="
            w-full
            mb-4
            bg-white/10
            border
            border-white/20
            text-white
            placeholder:text-slate-400
            rounded-xl
            px-4
            py-3
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/30
            "
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
            className="
            w-full
            mb-6
            bg-white/10
            border
            border-white/20
            text-white
            placeholder:text-slate-400
            rounded-xl
            px-4
            py-3
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/30
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            py-3.5
            rounded-xl
            text-white
            font-semibold
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all
            shadow-lg
            flex
            items-center
            justify-center
            gap-2
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Updating...
              </>
            ) : (
              <>
                <Lock size={18} />
                Update Password
              </>
            )}
          </button>

        </form>

        <div
          className="
          mt-8
          text-center
          text-xs
          text-slate-400
          "
        >
          © 2026 Hashmi Group • Secure Access
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;