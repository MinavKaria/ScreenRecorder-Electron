import {useEffect} from "react";
import "./styles/Settings.css";
import { Volume2, Mic, Monitor, Headphones, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

function Settings() {
  const navigate = useNavigate();
  const { settings, updateSetting, resetSettings } = useSettings();

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const availableSources = await window.electronAPI.getAudioSources();
        // setSources(availableSources);
        if (availableSources.length > 0) {
          // setSelectedSourceId(availableSources[0].id);
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="settings-card">
      <div className="settings-header">
        <button onClick={() => navigate(-1)} className="settings-back-btn">
          <ArrowLeft size={20} />
        </button>
        <h1 className="settings-title">Settings</h1>
      </div>
      <p className="settings-description">
        Configure your media capture preferences
      </p>

      <div className="settings-section">
        <div className="settings-group">
          <div className="settings-group-header">
            <Volume2 size={20} />
            <h3>Video Setting</h3>
          </div>

          <div className="settings-item">
            <label className="settings-label">Source</label>
            <select
              value={settings.audioQuality}
              onChange={(e) =>
                updateSetting(
                  "audioQuality",
                  e.target.value as "low" | "medium" | "high"
                )
              }
              className="settings-select"
            >
              <option value="low">Low (22kHz)</option>
              <option value="medium">Medium (44kHz)</option>
              <option value="high">High (48kHz)</option>
            </select>
          </div>
        </div>

        

        
      </div>

      <div className="settings-actions">
        <button
          className="settings-btn settings-btn-primary"
          onClick={() => {
            alert("Settings saved successfully!");
          }}
        >
          Save Settings
        </button>
        <button
          className="settings-btn settings-btn-secondary"
          onClick={() => {
            if (
              confirm("Are you sure you want to reset all settings to default?")
            ) {
              resetSettings();
            }
          }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}

export default Settings;
