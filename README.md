# DeviceShield

DeviceShield is a lightweight platform for registering devices, verifying IMEIs, reporting theft, and transferring ownership.

## Table of Contents

- [Demo](#demo)
- [Backend](#backend)
- [Frontend](#frontend)
- [Environment Setup](#environment-setup)
- [Running locally](#running-locally)
- [Deployment Guide](#deployment-guide)
- [Feature Overview](#feature-overview)
- [API Documentation](#api-documentation)

## Demo

https://deviceshieldng.onrender.com

## Backend

- Node.js + Express
- MongoDB + Mongoose

## Frontend

- React (Vite)
- Tailwind CSS
- Axios
- React Router

## Environment Setup

### Backend

Create `backend/.env` using [backend/.env.example](backend/.env.example).

### Frontend

Create `frontend/.env` using [frontend/.env.example](frontend/.env.example).

## Running locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment Guide

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Add a database user and whitelist your IP.
3. Copy the connection string into `MONGO_URI`.

### Render (Backend)

1. Create a new Web Service.
2. Root directory: `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add `MONGO_URI` and `PORT` environment variables.

### Vercel (Frontend)

1. Import the repository.
2. Set root directory to `frontend`.
3. Set `VITE_API_URL` to the Render backend URL.
4. Deploy.

## Feature Overview

- Register devices with unique IMEIs.
- Verify device status (safe, stolen, pending transfer).
- Report stolen devices.
- Transfer ownership with accept/reject flow.
- View devices by owner email.

## API Documentation

See [docs/API.md](docs/API.md).
