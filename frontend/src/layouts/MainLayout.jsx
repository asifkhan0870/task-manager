import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="min-h-screen bg-slate-100">

      {/* Sidebar is already fixed inside the component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Fixed Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
        }}
        className="md:pl-72"
      >
        <Navbar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Content — pushed down by navbar height (80px = h-20) and left by sidebar on desktop */}
      <div
        className="md:ml-72"
        style={{ paddingTop: "80px" }}
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>

    </div>
  );
}

export default MainLayout;