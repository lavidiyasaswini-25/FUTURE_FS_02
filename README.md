# LeadFlow CRM — MERN Stack

A simple CRM to manage client leads generated from website contact forms.

## Features
- ✅ Lead listing (name, email, source, status)
- ✅ Lead status updates (new / contacted / converted / lost)
- ✅ Notes and follow-ups for each lead
- ✅ Secure admin login (JWT-based auth)
- ✅ Search & filter leads
- ✅ Public lead-intake endpoint (for website contact forms)

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

---

## 📁 Project Structure
```
crm-mern/
├── server/          # Express + MongoDB API
│   ├── models/       # Lead.js, User.js
│   ├── routes/        # auth.js, leads.js
│   ├── middleware/    # authMiddleware.js
│   ├── index.js
│   └── .env
└── client/          # React frontend
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

---

## 🚀 Setup Instructions

### 1. Install MongoDB
Use a local install, or create a **free MongoDB Atlas cluster**: https://www.mongodb.com/cloud/atlas
Copy your connection string.

### 2. Backend Setup
```bash
cd server
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_db     # or your Atlas URI
JWT_SECRET=your_own_secret_key
```

Start the server:
```bash
npm run dev
```
✅ Server runs at `http://localhost:5000`

### 3. Frontend Setup
Open a **new terminal**:
```bash
cd client
npm install
npm start
```
✅ App opens at `http://localhost:3000`

---

## 🔑 First-Time Use

1. Go to `http://localhost:3000`
2. Click **"Register"** to create your first admin account
3. Log in and start managing leads

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create admin account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/leads` | ✅ | Get all leads (supports `?status=` `&search=`) |
| POST | `/api/leads` | ❌ | Create lead (use this from your website contact form) |
| PATCH | `/api/leads/:id/status` | ✅ | Update lead status |
| POST | `/api/leads/:id/notes` | ✅ | Add a note |
| DELETE | `/api/leads/:id` | ✅ | Delete a lead |

### Example: Submitting a lead from your website contact form
```js
fetch('http://localhost:5000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-1234',
    source: 'Contact Form'
  })
});
```

---

## 📦 Deployment

| Part | Recommended Host |
|---|---|
| Backend | Render / Railway |
| Frontend | Vercel / Netlify |
| Database | MongoDB Atlas (free tier) |

Remember to update:
- `client/package.json` → `"proxy"` (only used in local dev)
- Set `REACT_APP_API_URL` env var in production and update `client/src/api/index.js` baseURL accordingly
- Set `MONGO_URI`, `JWT_SECRET`, `PORT` as environment variables on your host

---

## 📤 Pushing to GitHub

```bash
cd crm-mern
git init
echo "node_modules/
.env
build/" > .gitignore
git add .
git commit -m "Initial commit: LeadFlow CRM (MERN)"
git remote add origin https://github.com/YOUR_USERNAME/crm-app.git
git branch -M main
git push -u origin main
```
