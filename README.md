# Event Dashboard

A real-time event feed system with NestJS backend and Next.js frontend.

## Features

- Real-time event updates using WebSocket
- Create new events
- View event status and history
- Error handling and retry mechanism
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run start:dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Open http://localhost:3000 in your browser

## API Endpoints

- `GET /events` - Get all events
- `POST /events` - Create a new event

## WebSocket Events

- `events` - Initial events list
- `newEvent` - New event notification
- `createEvent` - Create new event 