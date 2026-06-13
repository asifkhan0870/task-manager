import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const loadingToast = toast.loading("Signing in...");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      toast.success("Login successful", {
        id: loadingToast,
      });

      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password", {
        id: loadingToast,
      });
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
      {/* Animated Background */}

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

      {/* Login Card */}

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
        animate-[fadeIn_.5s_ease]
        "
      >
        {/* Logo */}

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
            <CheckCircle2
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
            Task Manager
          </h1>

          <p
            className="
            text-slate-300
            mt-2
            "
          >
            Welcome back to THG Platform
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleLogin}>
          {/* Email */}

          <div className="mb-5">
            <label
              className="
              block
              text-sm
              text-slate-300
              mb-2
              "
            >
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="john@example.com"
              className="
              w-full
              bg-white/10
              border
              border-white/20
              text-white
              placeholder:text-slate-400
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/30
              "
            />
          </div>

          {/* Password */}

          <div className="mb-6">
            <label
              className="
              block
              text-sm
              text-slate-300
              mb-2
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                className="
                w-full
                bg-white/10
                border
                border-white/20
                text-white
                placeholder:text-slate-400
                rounded-xl
                px-4
                py-3
                pr-12
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/30
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                hover:text-white
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Button */}

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
            disabled:opacity-70
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
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}

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

export default Login;