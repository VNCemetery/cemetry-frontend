export const DEFAULT_SEARCH_SIZE = 10;
export const DEFAULT_AUTO_SUGGEST_SIZE = 8;
export const DEFAULT_PAGE =0

export const RECORDING_CONFIG = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
    channelCount: 1,
  },
};

export const VOICE_DETECTION = {
  silenceThreshold: 0.005,
  silenceTimeout: 2000,
  maxRecordingTime: 5000,
  sampleSize: 2048,
};
