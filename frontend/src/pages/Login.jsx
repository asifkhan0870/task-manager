import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";

function Login() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async (e) => {

      e.preventDefault();

      if (loading) return;

      setLoading(true);

      const loadingToast =
        toast.loading(
          "Signing in..."
        );

      try {

        const response =
          await api.post(
            "/auth/login",
            {
              email,
              password
            }
          );

        localStorage.setItem(
          "token",
          response.data.access_token
        );

        toast.success(
          "Login successful",
          {
            id: loadingToast
          }
        );

        navigate(
          "/dashboard"
        );

      } catch (err) {

        toast.error(
          "Invalid email or password",
          {
            id: loadingToast
          }
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-100
      via-blue-50
      to-slate-200
      px-4
      "
    >

      <div
        className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-2xl
        p-8
        "
      >

        <div
          className="
          text-center
          mb-8
          "
        >

          <h1
            className="
            text-4xl
            font-bold
            text-slate-900
            "
          >
            Task Manager
          </h1>

          <p
            className="
            text-slate-500
            mt-3
            "
          >
            Manage tasks, assignments
            and team productivity.
          </p>

        </div>

        <form
          onSubmit={handleLogin}
        >

          <div
            className="
            mb-4
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
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter your email"
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
              focus:border-blue-500
              transition
              "
            />

          </div>

          <div
            className="
            mb-6
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
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
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
              focus:border-blue-500
              transition
              "
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            disabled:cursor-not-allowed
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            flex
            items-center
            justify-center
            gap-2
            "
          >

            {
              loading ? (
                <>
                  <Loader2
                    size={18}
                    className="
                    animate-spin
                    "
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )
            }

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
          © 2026 Hashmi Group
        </div>

      </div>

    </div>

  );
}

export default Login;