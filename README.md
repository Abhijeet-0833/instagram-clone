# 📸 Instagram Clone

A modern, full-stack Instagram Clone built with **React 19**, **Vite**, **Lucide Icons**, and an **Express.js / Node.js** backend.

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure JWT-based registration and login with persistent auth context.
- 📱 **Responsive UI**: Pixel-perfect Instagram desktop & mobile responsive design with native-feeling navigation bars.
- 📰 **Interactive Feed & Posts**:
  - Like, double-tap, comment, and save/bookmark posts.
  - Multi-image & video preview support.
  - Real-time notification toasts upon actions.
- 📸 **Stories & Viewer**: Interactive story tray with full-screen story viewer and progress indicator.
- 🎬 **Reels**: Dedicated vertical video reels player with audio controls, comment overlay, and quick reactions.
- 🔍 **Explore & Search**: Dynamic discovery grid and quick search modal for finding users and content.
- 💬 **Direct Messages**: Inbox layout with active chat threads and quick message composition.
- 🔔 **Notifications**: Visual updates for likes, comments, and new followers.
- 👤 **Profile Management**: Profile page featuring post grids, saved posts tab, follower counts, and custom profile editing.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM 7
- **Styling**: Vanilla CSS (Custom Design Tokens, Flexbox/Grid, Dark & Light subtle tones)
- **Icons**: Lucide React (`lucide-react`)

### Backend
- **Server**: Node.js + Express
- **Auth**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Data**: In-memory / JSON store with RESTful endpoint structure

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/Abhijeet-0833/instagram-clone.git
cd instagram-clone
```

### 2. Backend Setup & Startup
```bash
cd server
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup & Startup
Open a new terminal window in the project root directory:
```bash
npm install
npm run dev
# App will run on http://localhost:5173
```

---

## 🔧 Environment Variables

You can optionally configure `.env` in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Quality Assurance & Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement (HMR) |
| `npm run build` | Builds the production bundle with Vite (`dist/`) |
| `npm run lint` | Runs ESLint analysis across all components |
| `npm run preview` | Locally previews the production build |

---

## 📄 License

MIT License. Designed and developed by [Abhijeet-0833](https://github.com/Abhijeet-0833).
