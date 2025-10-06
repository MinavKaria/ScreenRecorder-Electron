import React from "react";
// import "./styles/Navbar.css"; 
import {Settings,Minus,X} from 'lucide-react'
import {useNavigate} from 'react-router-dom'

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <span className="navbar-title">Screen-Recorder</span>
      <div className="navbar-buttons">
        <button className="btn-minimize"
        onClick={()=>{
            window.electronAPI.minimize();
        }}
        >
          <Minus color="white" size={20}/>
        </button>
        <button className="" onClick={()=>{
          navigate('/settings');
        }}>
          <Settings color="white" size={20}/>
        </button>
        <button className="btn-close"
        onClick={()=>{
            window.electronAPI.close();
        }}
        >
          <X color="white" size={20}/>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
