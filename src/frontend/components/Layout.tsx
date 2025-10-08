import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
            maxHeight: "100vh",
            maxWidth: "600px",
            // border: "1px solid #ccc",
            borderRadius: "8px",

        }}
      >
        <Navbar />
        <div
          style={{
            // padding: "20px",

          }}
        >
            <div style={{
                height: "30px"
            }}>

            </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
