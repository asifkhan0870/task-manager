import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
      flex
      min-h-screen
      bg-slate-100
      overflow-x-hidden
      "
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

<div
  className="
  flex-1
  md:ml-72
  min-w-0
  w-full
  flex
  flex-col
  overflow-x-hidden
  "
>
        <Navbar
          setSidebarOpen={setSidebarOpen}
        />

<main
  className="
  flex-1
  overflow-y-auto
  p-4
  md:p-6
  pt-24
  "
>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;