export const userMediaConstraints = {
  video: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};

export const iceConfig = {
  iceServers: [{ url: "stun:stun.l.google.com:19302" }],
};
