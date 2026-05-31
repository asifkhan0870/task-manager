import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (

    <div
      className="
      flex
      min-h-screen
      "
    >

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className="
        flex-1
        min-w-0
        "
      >

        <Navbar
          setSidebarOpen={setSidebarOpen}
        />

        <div
          className="
          p-4
          md:p-6
          "
        >
          {children}
        </div>

      </div>

    </div>
  );
}

export default MainLayout;