# Mentor Match — Simple Explanation

What this project is (one short sentence):

This is a website that helps students find mentors and talk to them. It also has a small feature to buy a subscription (pay money to unlock some pages).

Who uses it:

- Student (also called "mentee") — someone who learns and asks questions.
- Mentor — someone who helps the student and gives feedback.

Big pieces (easy words):

- Frontend: The website pages you click (made with React).
- Backend: The server that does the work when the website asks for things (Node + Express).
- Database: A place that keeps users and messages safe (MongoDB).
- Payments: Razorpay helps people pay money for a subscription.

Two tiny diagrams to show how it works

1) Main app flow (very simple):

   YOU (student)  --->  WEBSITE (frontend)
         |                    |
         |                    V
         |              SERVER (backend)
         |                    |
         V                    V
     your browser      <---  DATABASE (MongoDB)

Say it out loud: You click the website -> the website asks the server -> the server talks to the database -> the answer comes back.

2) Payment (buy subscription) flow (very short):

   YOU click "Buy"  --->  WEBSITE asks SERVER to make an order
                                 |
                                 V
                  SERVER asks RAZORPAY to make a payment order
                                 |
                                 V
                 RAZORPAY shows a small popup to let you pay
                                 |
              YOU finish payment in the popup (or cancel)
                                 |
                                 V
           WEBSITE asks SERVER to check (verify) the payment
                                 |
                                 V
           SERVER checks with RAZORPAY and saves subscription in DATABASE

How to run this on your computer (PowerShell commands):

1) Start the backend (server):

```powershell
cd backend
npm install
# if there is a dev script (nodemon): npm run dev
npm start
```

2) Start the frontend (website):

```powershell
cd frontend
npm install
npm run dev
```

Open the browser at the address the frontend shows (usually http://localhost:5173). The backend usually runs at http://localhost:5001.

Important secret names (put these in `backend/.env`):

- MONGODB_URI — where to store data
- JWT_SECRET — secret word used for login
- RAZORPAY_KEY_ID — payment key id (keep it secret)
- RAZORPAY_KEY_SECRET — payment secret (keep it very secret)

Where to look in the code (quick map):

- Frontend pages: `frontend/src/pages/` (look at `ProgressPage.jsx`, `ProfilePage.jsx`, `StudentHelper.jsx`, `HomePage.jsx`)
- Frontend index file: `frontend/index.html` (Razorpay script is added here)
- Backend controllers: `backend/src/controllers/` (search for `payment.controller.js`)
- Backend routes: `backend/src/routes/` (search for `payment.route.js`)
- User model: `backend/src/models/user.model.js` (subscription is saved here)

Draw it on paper:

1. Draw a person labeled "Student" on the left, a screen labeled "Website" in the middle, a box labeled "Server" on the right, and a cylinder below the server labeled "Database".
2. Draw arrows left to right: Student -> Website -> Server -> Database. Then draw arrows back from Database to Server to Website to Student.
3. For payments, draw a cloud labeled "Razorpay" above the Website and Server and draw arrows going to and from it for the payment steps.

If you want this even shorter or want an image instead of words, say "Make picture" and I will make a simple SVG diagram for you.

Thank you — this README is meant to be as simple as possible so a child can read it and draw the workflows.
# Mentor Connect

Mentor Connect is a full-stack web application that connects mentees with mentors for personalized guidance, chat, and career growth. Built with a React frontend and Node.js/Express backend, it supports real-time messaging, user authentication, and role-based access for mentors and mentees.

## Features

- User authentication (signup, login, logout)
- Role-based access: Mentor and Mentee
- Mentees can browse and request mentorship from mentors
- Mentors can view and manage mentorship requests
- Real-time chat between connected mentors and mentees
- Profile management with avatar upload
- Responsive and modern UI with Tailwind CSS and DaisyUI

## Tech Stack

- **Frontend:** React, Vite, Zustand, React Router, Tailwind CSS, DaisyUI, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, Cloudinary (for image uploads)
- **Authentication:** JWT, Cookies
# Mentor Connect

Mentor Connect (aka MentorMatch) is a full-stack mentorship platform that helps learners discover, book, and interact with experienced mentors. It combines real-time chat, structured progress tracking, AI-assisted tools (resume reviewer, AI mentor), and subscription payments to provide a modern mentoring experience.

This README gives a quick overview, development setup, and pointers to important parts of the codebase.

## Purpose

- Connect mentees with mentors for career guidance, interview prep, and project reviews.
- Provide a lightweight marketplace where mentors can list services and mentees can book paid or short micro-sessions.
- Help learners track their progress and get AI-assisted reviews of resumes and interview performance.

## Key features

- Role-based access: Mentor and Mentee flows.
- Real-time chat using Socket.io for mentor–mentee conversations.
- Booking & scheduling with session management.
- Razorpay subscription & payment flow (server-side order creation + signature verification).
- Gated Progress Tracker available to subscribed users.
- Resume review flow (human reviewer + optional AI assistance).
- Student Helper: curated AI tools directory with favorites and quick access.
- Profile management with avatar uploads (Cloudinary).
- Notifications, email flows, and admin utilities.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Zustand, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.io
- Storage / Uploads: Cloudinary
- Payments: Razorpay (server-side secret usage)
- Automation (recommended): n8n or cron jobs for background tasks

## Repo structure (high level)

```
mentor-match-main/
  backend/
    src/
      controllers/      # express controllers (auth, payments, mentor, message, connection)
      lib/              # db, utils, socket helpers
      middleware/       # auth middleware
      models/           # mongoose schemas
      routes/           # express routers
      index.js          # backend entry
    package.json
    .env               # local env (not committed)
  frontend/
    src/
      pages/            # React pages (Home, Chat, Progress, Profile...)
      components/       # shared components
      store/            # Zustand stores
      lib/              # axios instance, utils
      main.jsx, App.jsx
    package.json
  README.md
  package.json
  .gitignore
```

## Development setup (quick)

Windows PowerShell commands (from repo root):

```powershell
# Backend
cd .\backend
npm install
# create .env based on .env.example, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET if testing payments
npm run dev

# In a separate terminal: Frontend
cd ..\frontend
npm install
npm run dev

# Open the frontend URL (Vite usually shows http://localhost:5173)
```

Notes:
- Backend expects environment variables (example):

```
PORT=5001
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
```

## Important endpoints (development)

- POST /api/auth/login — authenticate user
- GET /api/auth/check — fetch logged-in user (used by frontend store)
- POST /api/payments/create-order — create Razorpay order (protected)
- POST /api/payments/verify — verify payment and update subscription (protected)
- Socket.io endpoint used for messaging (configured in backend/lib/socket.js)

## Running tests & linting

This project does not include automated unit tests by default. Consider adding small tests for backend controllers and frontend components. You can run linters or formatters if configured via package.json scripts.

## Deployment notes

- Keep secret keys out of source control. Use environment variables or secret managers.
- For production, run the backend on a Node host (Heroku, Railway, Render, DigitalOcean, or VPS). Use a managed MongoDB (Atlas) and secure TLS.
- For payments, use Razorpay webhooks in addition to synchronous verification to reconcile payments server-side.
- Consider using n8n or a small worker/cron to run recurring jobs: subscription expiry, reminders, data sync, and reconciliation.

## Ideas & roadmap (quick)

- Add session recordings + transcripts (Whisper) and attach to user history.
- Improve matching with a weighted recommendation engine.
- Add cohort/group sessions & paid masterclasses.

## Contributing

1. Fork the repo and create a feature branch.
2. Implement changes and add tests where applicable.
3. Open a pull request with a clear description of what changed and why.

## Contact

If you want help implementing features (payments, workflows with n8n, or AI integrations like resume reviewer), tell me which feature and I can provide a scoped plan and code changes.

---

_Generated README — tailored for local development and quick onboarding._
