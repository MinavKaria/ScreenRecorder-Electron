import React from "react";
import "./styles/Navbar.css"; 

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <span className="navbar-title">My Electron App</span>
      <div className="navbar-buttons">
        <button className="btn-minimize"
        onClick={()=>{
            window.electronAPI.minimize();
        }}
        >➖</button>
        <button className="btn-close"
        onClick={()=>{
            window.electronAPI.close();
        }}
        >❌</button>
      </div>
    </div>
  );
};

export default Navbar;
