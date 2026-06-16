import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import CreateTask from "./pages/CreateTask";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";
import ChangePassword from "./pages/ChangePassword";
import Notifications
from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tasks" element={<AllTasks />} />

        <Route path="/create-task" element={<CreateTask />} />

        <Route path="/my-tasks" element={<MyTasks />} />

        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
  path="/notifications"
  element={<Notifications />}
/>
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
