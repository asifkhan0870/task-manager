import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

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

      navigate("/dashboard");

    } catch (err) {

      alert(
        "Invalid Credentials"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-4xl font-bold mb-8">
          Task Manager
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;