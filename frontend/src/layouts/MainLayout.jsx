import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div
      className="min-h-screen bg-slate-100"
      style={{ display: "flex" }}
    >

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className="flex-1 min-w-0 md:ml-72"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >

        {/* Sticky Navbar */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <Navbar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Scrollable content */}
        <div className="p-4 md:p-6" style={{ flex: 1 }}>
          {children}
        </div>

      </div>

    </div>
  );
}

export default MainLayout;