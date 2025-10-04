# Realtime Polling 🎯

A full-stack **NestJS + Prisma + Socket.IO** app for creating polls, voting, and seeing results update in real time.

---

## Features

* **Authentication** (JWT-based):

  * Sign up and log in with email/password
* **Poll Management**:

  * Create polls with options
  * Publish or keep drafts
  * List all polls or only published ones
  * Get all polls created by the logged-in user
* **Voting**:

  * Vote for options via REST API
  * See live vote counts via WebSocket broadcasts
* **User Management**:

  * View all users (admin/debug route)
* **Realtime Updates**:

  * Clients in a poll room get notified immediately when someone votes

---

## Tech Stack

* **Backend**: NestJS (TypeScript)
* **Database**: Prisma ORM
* **Realtime**: Socket.IO Gateway
* **Auth**: JWT (jsonwebtoken)
* **Other**: ESLint, Prettier, Jest

---

## Installation

1. Clone repository:

   ```bash
   git clone https://github.com/RUDRANSHFLY/realtime-polling.git
   cd realtime-polling
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment:

   Create `.env`:

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/realtime_polling
   JWT_SECRET=123456
   PORT=3000
   ```

4. Setup Prisma:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Run project:

   ```bash
   npm run start:dev
   ```

---

## API Documentation

👉 After starting the server, open [http://localhost:3000/api](http://localhost:3000/api) to explore **Swagger API docs**.

---

## REST API Endpoints

All routes are prefixed with `/api`.

### Auth

| Method | Endpoint           | Description       | Body Example                                                            |
| ------ | ------------------ | ----------------- | ----------------------------------------------------------------------- |
| POST   | `/api/auth/signup` | Register new user | `{ "name": "John", "email": "john@example.com", "password": "secret" }` |
| POST   | `/api/auth/signin` | Login user        | `{ "email": "john@example.com", "password": "secret" }`                 |

---

### Users

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| GET    | `/api/users` | Get all users |

---

### Poll

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| GET    | `/api/poll`             | Get all published polls                 |
| GET    | `/api/poll/me`          | Get all polls created by logged-in user |
| POST   | `/api/poll`             | Create a poll with options              |
| PATCH  | `/api/poll/:id/publish` | Publish a draft poll                    |

---

### Vote

| Method | Endpoint    | Description                   | Body Example                                           |
| ------ | ----------- | ----------------------------- | ------------------------------------------------------ |
| POST   | `/api/vote` | Cast a vote for a poll option | `{ "pollId": "<poll-id>", "optionId": "<option-id>" }` |

---

## WebSocket (Realtime)

1. Connect with token:

   ```js
   import { io } from "socket.io-client";

   const socket = io("http://localhost:3000", {
     auth: { token: "123456" } // JWT token
   });

   socket.on("connect", () => {
     console.log("Connected:", socket.id);
   });
   ```

2. Join a poll room:

   ```js
   socket.emit("watchPoll", "7951b232-51ff-4f99-9cfe-2ca3d1d3049b");
   ```

3. Listen for vote updates:

   ```js
   socket.on("voteUpdate", (data) => {
     console.log("Vote update:", data);
     // { pollId, counts: [{ id, text, voteCount }] }
   });
   ```

---

## Testing Flow

1. **Sign up / Sign in** → get JWT token
2. **Create poll** → with options
3. **Publish poll** (`PATCH /api/poll/:id/publish`)
4. **Connect client via WebSocket** (`watchPoll`)
5. **Vote via REST** (`POST /api/vote`)
6. **See realtime updates** pushed to connected clients 🎉

---

## Future Improvements

* Role-based access (e.g. only poll owner can publish)
* Allow multiple-choice polls
* Add frontend client (React/Next.js) for demo
* Admin dashboard for managing polls

---

## License

MIT

