# 🕋 Kiriman — Frontend

A full-stack Umrah doa (prayer) platform that lets pilgrims share a unique link with family and friends, who can then send doa messages without needing to log in. The pilgrim reads them in a slide-view inbox — designed to be read at the Kaabah.

This is the **React frontend** for Kiriman. The backend repo lives at [kiriman-backend](https://github.com/Adlina01/kiriman-backend).

🔗 **Live App:** [kiriman.vercel.app](https://kiriman.vercel.app)

---

## ✨ Features

- 🔐 Login with email/password or Google
- 💌 Public "send a doa" page via a shareable unique link — no login required for senders
- 📥 Slide-view doa inbox
- ✈️ Journey tracker with countdown and phase detection (Preparing / In Makkah / Completed)
- 🤖 AI-powered doa suggestions on the sender's page to help write a message
- 📊 Dashboard showing doa stats (received, read, unread) and a shareable link

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Create React App) |
| Language | JavaScript |
| Routing | React Router |
| HTTP Client | Axios |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- The [kiriman-backend](https://github.com/Adlina01/kiriman-backend) running locally or deployed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adlina01/kiriman-frontend.git
   cd kiriman-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your local environment**

   Create a `.env.local` file (gitignored):
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

4. **Run the app**
   ```bash
   npm start
   ```

---

## 📁 Project Structure

```
kiriman-frontend/
├── src/
│   ├── pages/          # Login, Register, Dashboard, DoaInbox, SendDoa, Journey, LandingPage
│   ├── services/        # api.js — backend API calls
│   └── App.js
└── package.json
```

---

## 🙋‍♀️ Developer

Built independently by **Adlina Amalin** — [@Adlina01](https://github.com/Adlina01)
