import createRhinoState from "react-rhino";

const { RhinoProvider, useRhinoState } = createRhinoState({
  roomName: null,
  isStarted: false,
  shareScreen: false,
  userName: "",
  localStream: null,
  screenStream: null,
});

export { RhinoProvider, useRhinoState };
