import  { useEffect, useRef, useState } from "react";
import { Monitor, FolderOpen, Square, Circle, Download } from "lucide-react";
import "./styles/Home.css";

export default function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [sources, setSources] = useState<{ id: string; name: string }[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>("");
  const [saveFolder, setSaveFolder] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready to record");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const availableSources = await window.electronAPI.getAudioSources();
        setSources(availableSources);
        if (availableSources.length > 0) {
          setSelectedSourceId(availableSources[0].id);
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };
    fetchSources();
  }, []);

  const chooseSaveFolder = async () => {
    try {
      const folderPath = await window.electronAPI.chooseFolder();
      if (folderPath) {
        setSaveFolder(folderPath);
        setStatus(`Will save to: ${folderPath}`);
      }
    } catch (error) {
      console.error("Error choosing folder:", error);
      setStatus("Error choosing folder");
    }
  };

  const startRecording = async () => {
    try {
      if (!selectedSourceId) {
        setStatus("Please select a screen first");
        return;
      }

      if (!saveFolder) {
        setStatus("Please choose a save folder first");
        return;
      }

      setStatus("Starting recording...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedSourceId,
          } as any,
        },
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedSourceId,
            maxWidth: 1920,
            maxHeight: 1080,
            maxFrameRate: 30,
          } as any,
        },
      } as any);

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=h264,opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);
        setStatus("Recording stopped. Ready to save.");
      };

      mediaRecorder.start(1000); 
      setRecording(true);
      setStatus("Recording in progress...");
    } catch (error: any) {
      console.error("Error starting recording:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setRecording(false);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const saveRecording = async () => {
    if (!recordedBlob || !saveFolder) return;

    try {
      setStatus("Saving recording...");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `screen-recording-${timestamp}.webm`;

      const arrayBuffer = await recordedBlob.arrayBuffer();
      const result = await window.electronAPI.saveRecording(
        arrayBuffer,
        fileName,
        saveFolder
      );

      if (result.success) {
        setStatus(`Recording saved: ${result.path}`);
        setRecordedBlob(null);
      } else {
        setStatus(`Save error: ${result.error}`);
      }
    } catch (error: any) {
      console.error("Error saving recording:", error);
      setStatus(`Save error: ${error.message}`);
    }
  };

  return (
    <div className="screen-recorder-card">
      

       <div className="preview-section">
        <video
          ref={videoRef}
          width="400"
          height="225"
          muted
          className="preview-video"
        />
      </div>

      <div className="recorder-controls">
        <div className="control-group">
          <label>Select Screen:</label>
          <select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            disabled={recording}
          >
            {sources.map((source, index) => (
              <option key={source.id} value={source.id}>
                Screen {index}: {source.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group" style={{
          justifyContent:"space-around"
        }}>
          <div >
          <button
            onClick={chooseSaveFolder}
            disabled={recording}
            className="folder-btn"
          >
            <FolderOpen size={16} />
            Choose Save Folder
          </button>
          {saveFolder && <span className="folder-path">📁 {saveFolder}</span>}
          </div>
          <div>  <div className="recording-controls">
          {!recording ? (
            <button
              onClick={startRecording}
              disabled={!selectedSourceId || !saveFolder}
              className="record-btn start"
            >
              <Circle size={16} />
              Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="record-btn stop">
              <Square size={16} />
              Stop Recording
            </button>
          )}

          {recordedBlob && (
            <button onClick={saveRecording} className="save-btn">
              <Download size={16} />
              Save Recording
            </button>
          )}
        </div>
      </div>
</div>
        </div>

      
      <div className="status-bar">
        <span className={`status ${recording ? "recording" : ""}`}>
          {recording && <span className="recording-dot"></span>}
          {status}
        </span>
      </div>

     

      
      
    </div>
  );
}
