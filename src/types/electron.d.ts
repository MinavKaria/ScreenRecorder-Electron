export interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  
  chooseFolder: () => Promise<string | null>;
  saveRecording: (buffer: ArrayBuffer, fileName: string, folderPath: string) => Promise<{ success: boolean; path?: string; error?: string }>;
  getAudioSources: () => Promise<{ id: string; name: string }[]>;
   getSources: () => Promise<DesktopCapturerSource[]>;
  createOverlay: () => Promise<{ success: boolean }>;
  closeOverlay: () => Promise<{ success: boolean }>;
  moveOverlay: (direction: string) => Promise<void>;
  toggleClickThrough: (enabled: boolean) => Promise<void>;
  updateOverlayContent: (data: { text: string; profile?: string }) => void;
  onContentUpdate: (callback: (data: any) => void) => void;
  onMoveOverlay: (callback: (direction: string) => void) => void;
  onToggleClickThrough: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


