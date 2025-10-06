import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


export interface AppSettings {
  audioQuality: "low" | "medium" | "high";
  microphoneLevel: number;
  systemAudio: boolean;
  outputDevice: string;

  recordingQuality: "720p" | "1080p" | "4k";
  frameRate: 30 | 60;
  autoStart: boolean;
  saveFolder: string;
  
  selectedSourceId: string;

  theme: "dark" | "light";
  showPreview: boolean;

  status:string,
  
}


const defaultSettings: AppSettings = {
  audioQuality: "high",
  microphoneLevel: 75,
  systemAudio: true,
  outputDevice: "default",
  recordingQuality: "1080p",
  frameRate: 30,
  autoStart: false,
  saveFolder: "",
  selectedSourceId: "",
  theme: "dark",
  showPreview: true,
  status:"Ready to record",
  
};


interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  updateMultipleSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
  loadSettings: () => void;
}


const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);


  useEffect(() => {
    loadSettings();
  }, []);


  useEffect(() => {
    saveSettings();
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateMultipleSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("truhire-settings");
  };

  const saveSettings = () => {
    try {
      localStorage.setItem("truhire-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem("truhire-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
    
        setSettings((prev) => ({
          ...defaultSettings,
          ...parsed,
        }));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      setSettings(defaultSettings);
    }
  };

  const contextValue: SettingsContextType = {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    saveSettings,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};


export { SettingsContext };
