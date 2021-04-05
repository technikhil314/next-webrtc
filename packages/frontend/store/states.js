import createRhinoState from "react-rhino";

const { RhinoProvider, useRhinoState } = createRhinoState({
  roomName: null,
  isStarted: false,
  shareScreen: false,
  userName: "",
  localStream: null,
});

export { RhinoProvider, useRhinoState };
