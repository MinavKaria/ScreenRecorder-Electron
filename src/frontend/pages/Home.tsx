import { useEffect, useRef, useState } from "react";
import { Monitor, FolderOpen, Square, Circle, Download } from "lucide-react";
import "./styles/Home.css";
import { useSettings } from "../context/SettingsContext";
import settings from "./Settings";

export default function ScreenRecorder() {
    const [recording, setRecording] = useState(false);
    const [sources, setSources] = useState<{ id: string; name: string }[]>([]);
    const [selectedSourceId, setSelectedSourceId] = useState<string>("");
    const { settings, updateSetting } = useSettings();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);


    // useEffect(() => {
    //     if (recordedBlob) {
    //         const url = URL.createObjectURL(recordedBlob);
    //         setVideoUrl(url);
    //
    //
    //         return () => {
    //             URL.revokeObjectURL(url);
    //             setVideoUrl(null);
    //         };
    //     }
    // }, [recordedBlob]);

    // Set stream to video element when recording starts
    useEffect(() => {
        if (recording && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(err => console.error("Error playing video:", err));
        }
    }, [recording]);

    const setStatus = (status: string) => {
        updateSetting("status", status);
    };

    const saveFolder = settings.saveFolder;
    const setSaveFolder = (folder: string) => {
        updateSetting("saveFolder", folder);
    };


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


            setRecordedBlob(null);
            setVideoUrl(null);

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

            setRecording(true);


            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=h264,opus',
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

                console.log("Blob created:", {
                    size: blob.size,
                    type: blob.type,
                    chunks: chunksRef.current.length,
                });

                if (blob.size === 0) {
                    setStatus("Recording failed: No data captured");
                    return;
                }

                setRecordedBlob(blob);
                setStatus("Recording stopped. Ready to save or preview.");
            };

            mediaRecorder.start(1000);
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
                setVideoUrl(null);
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
                <div className="preview-section">

                    {recording && (
                        <video
                            ref={videoRef}
                            width="400"
                            height="225"
                            muted
                            className="preview-video"
                            autoPlay
                        />
                    )}


                    {/*{!recording && videoUrl && (*/}
                    {/*    <video*/}
                    {/*        width="400"*/}
                    {/*        height="225"*/}
                    {/*        controls*/}
                    {/*        className="preview-video"*/}
                    {/*        src={videoUrl}*/}
                    {/*        onLoadedMetadata={() => console.log("Video loaded successfully")}*/}
                    {/*        onError={(e) => console.error("Video error:", e)}*/}
                    {/*    />*/}
                    {/*)}*/}


                    {!recording && !videoUrl && (
                        <div className="preview-placeholder" style={{
                            width: "400px",
                            height: "225px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#1a1a1a",
                            border: "2px dashed #333",
                            borderRadius: "8px"
                        }}>
                            <Monitor size={48} style={{ opacity: 0.3 }} />
                        </div>
                    )}
                </div>
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
                            <option
                                key={source.id}
                                value={source.id}
                                style={{
                                    background: "black",
                                }}
                            >
                                Screen {index}: {source.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    className="control-group"
                    style={{
                        justifyContent: "space-around",
                    }}
                >
                    <div>
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
                    <div>
                        <div className="recording-controls">
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
        </div>
    );
}