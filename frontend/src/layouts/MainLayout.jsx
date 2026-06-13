import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#f1f5f9"
    }}>

      {/* Sidebar — fixed inside component at z-50 */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right column */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        marginLeft: 0,
      }}
        className="md:ml-72"
      >

        {/* Navbar — never scrolls */}
        <div style={{ flexShrink: 0 }}>
          <Navbar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Scrollable content only */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </div>

      </div>

    </div>
  );
}

export default MainLayout;