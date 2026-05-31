import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({
  children
}) {

  return (

    <div
      className="
      flex
      flex-col
      md:flex-row
      min-h-screen
      "
    >

      <Sidebar />

      <div
        className="
        flex-1
        min-w-0
        "
      >

        <Navbar />

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