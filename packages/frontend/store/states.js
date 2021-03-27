import createRhinoState from "react-rhino";

const { RhinoProvider, useRhinoState } = createRhinoState({
  roomName: null,
  isStarted: false,
});

export { RhinoProvider, useRhinoState };
