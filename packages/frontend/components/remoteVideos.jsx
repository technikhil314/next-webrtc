import Video from "./video";

export default function RemoteVideos({ peers, userNames }) {
  const remoteVideos = [];
  for (let peerId in peers) {
    let peer = peers[peerId];
    remoteVideos.push(
      <Video
        peer={peer}
        key={peer.stream ? peer.stream.id : Date.now()}
        userName={userNames[peerId]}
      />
    );
  }
  return remoteVideos;
}
