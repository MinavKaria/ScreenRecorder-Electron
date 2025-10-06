import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          // style={{
          //   flex: 1,
          // }}
        >
          <Navbar />
        </div>
        <div className="spacer"></div>
        <div
          className="content page-container"
          // style={{
          //   flex: 1,
          // }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
