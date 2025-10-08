import React from "react";
import { Settings, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import './styles/Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isRecording = settings.status.toLowerCase().includes("recording in progress");
  const statusText = isRecording ? "Recording in progress..." : settings.status || "Idle";

  return (
    <div className="navbar">
      <span className="navbar-title">Screen-Recorder</span>
      <div className="navbar-buttons">
        <div className="navbar-status">
          <span className={`navbar-status-dot${isRecording ? ' recording' : ''}`}></span>
          <span className={`navbar-status-pill${isRecording ? ' recording' : ''}`}>{statusText}</span>
        </div>
        <button className="btn-minimize"
        onClick={() => {
            window.electronAPI.minimize();
        }}
        >
          <Minus color="white" size={20}/>
        </button>
        <button className="" onClick={() => {
          navigate('/settings');
        }}>
          <Settings color="white" size={20}/>
        </button>
        <button className="btn-close"
        onClick={() => {
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
