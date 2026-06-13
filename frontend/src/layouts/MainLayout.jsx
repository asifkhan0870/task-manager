import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>

      {/* Sidebar — already fixed at z-50 inside component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main column — offset from sidebar on desktop */}
      <div style={{ marginLeft: 0 }} className="md:ml-72">

        {/* Fixed Navbar */}
        <nav style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 25,
          marginLeft: 0,
        }}
          className="md:pl-72"
        >
          <Navbar setSidebarOpen={setSidebarOpen} />
        </nav>

        {/* Page content — padded below fixed navbar (h-20 = 80px) */}
        <main style={{ paddingTop: "80px" }}>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default MainLayout;