import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import CreateTask from "./pages/CreateTask";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tasks" element={<AllTasks />} />

        <Route path="/create-task" element={<CreateTask />} />

        <Route path="/my-tasks" element={<MyTasks />} />

        <Route
  path="/tasks/:id"
  element={<TaskDetails />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
