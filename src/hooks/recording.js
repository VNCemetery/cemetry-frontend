const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.wav";
      a.click();
      chunks.current = [];
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingTime(0);

    // Auto stop after 5 seconds
    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop();
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      }
    }, 5000);
  } catch (err) {
    console.error("Error accessing microphone:", err);
  }
};
