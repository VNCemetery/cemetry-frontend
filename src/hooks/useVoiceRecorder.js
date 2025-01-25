import { useState, useRef, useEffect } from "react";
import { RECORDING_CONFIG } from "../utils/constants";

export const useVoiceRecorder = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const chunks = useRef([]);
  const silenceTimeout = useRef(null);
  const silenceCheckInterval = useRef(null);

  const checkForSilence = () => {
    if (!analyser.current || !dataArray.current) return;

    analyser.current.getFloatTimeDomainData(dataArray.current);
    let rms = calculateRMS(dataArray.current);

    updateVoiceLevel(rms);
    handleSilenceDetection(rms);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        RECORDING_CONFIG
      );
      setupAudioAnalysis(stream);
      setupMediaRecorder(stream);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(
        "Không thể truy cập microphone. Vui lòng kiểm tra lại quyền truy cập và thiết bị."
      );
    }
  };

  // ... rest of the implementation

  return {
    isRecording,
    isSilent,
    voiceLevel,
    recordingTime,
    startRecording,
  };
};
