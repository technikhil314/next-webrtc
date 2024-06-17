# An open source live screen share and webcam video recorder

- [An open source live screen share and webcam video recorder](#an-open-source-live-screen-share-and-webcam-video-recorder)
  - [Deploy your instance](#deploy-your-instance)
  - [Features](#features)
  - [Contributions](#contributions)
    - [Requirements](#requirements)
    - [Code structure](#code-structure)
    - [How to run](#how-to-run)
    - [.env contents](#env-contents)
    - [How to build](#how-to-build)
  - [TO DO](#to-do)

## Deploy your instance

1. Deploy the backend project to some cloud (heroku etc) to consume websockets.
1. Deploy the frontend project to vercel with single click [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftechnikhil314%2Fnext-webrtc)
1. Add required env variables
   - NEXT_PUBLIC_WEBSOCKET_URL - URL to your websocket server. The backend deployment. If you want to use meeting feature
   - NEXT_PUBLIC_URL - URL of your site
   - NODE_ENV - `development` or `production`

## Features

- Background removal
- Virtual backgrounds
- Background blur

## Contributions

Welcome :)

### Requirements

1. Node >= v15.x
2. npm >= v7
3. yarn 1.x

### Code structure

1. It is a monorepo managed by yarn
2. There are two packages backend and frontend
3. Backend is just a small websocket server used for signaling
4. Frontend is actual UI built with nextjs
5. It uses google stun server for populating ice candidates

### How to run

1. Install all dependencies using `yarn --frozen-lockfile`
2. add `.env` see the contents [below](#env-contents)
3. run backend using `yarn workspaces @openrtc/backend start`
4. run frontend using `yarn workspaces @openrtc/frontend start`

### .env contents

```bash
NEXT_PUBLIC_WEBSOCKET_URL=wss://localhost:4000/
NODE_ENV=development
NEXT_PUBLIC_URL=http://localhost:3000
```

### How to build

1. You dont need to build backend
1. You can build frontend package with `yarn workspaces @openrtc/frontend build` command

## TO DO

1. Handle if someone stops screen share in recording vlog
   - This currently stops recording
   - Ideally it should keep on recording but change video from screen to user
1. First time visitor faces lag in audio recording
1. First time visitor can not see small PiP video
1. Microphone volume control
1. Ability to name the video file - Currently it uses ISO date time string
