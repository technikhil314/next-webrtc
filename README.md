# An open source live screen share and webcam video recorder

- [An open source live screen share and webcam video recorder](#an-open-source-live-screen-share-and-webcam-video-recorder)
  - [Deploy to vercel](#deploy-to-vercel)
  - [Features](#features)
  - [Contributions](#contributions)
    - [Requirements](#requirements)
    - [Code structure](#code-structure)
    - [How to run](#how-to-run)
    - [How to build](#how-to-build)
  - [TO DO](#to-do)

## Deploy to vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftechnikhil314%2Fnext-webrtc)

## Features

- Background removal
- Virtual backgrounds
- Background blur

## Contributions

### Requirements

1. Node >= v15.x
2. npm >= v7

### Code structure

1. It is a monorepo managed by yarn
2. There are two packages backend and frontend
3. Backend is just a small websocket server used for signaling
4. Frontend is actual UI built with nextjs
5. It uses google stun server for populating ice candidates

### How to run

1. Install all dependencies using `npm ci`
1. npm run start --prefix packages/frontend
1. npm run start --prefix packages/backend

### How to build

1. You dont need to build backend
2. You can build frontend package with `npm run build --prefix packages/frontend` command

## TO DO

1. Handle if someone stops screen share in recording vlog
   - This currently stops recording
   - Ideally it should keep on recording but change video from screen to user
1. First time visitor faces lag in audio recording
1. First time visitor can not see small PiP video
1. Microphone volume control
1. Ability to name the video file - Currently it uses ISO date time string
