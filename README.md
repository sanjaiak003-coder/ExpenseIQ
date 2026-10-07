# 💰 ExpenseIQ — MERN Stack Expense Tracker

A modern, full-stack personal finance application built with the **MERN** stack (MongoDB, Express, React, Node.js). Track income and expenses, organize with custom categories, visualize spending with interactive Chart.js charts, and analyze finances with monthly and annual reports.

---

## ✨ Features

- **🔐 Authentication & Security**
  - JWT (JSON Web Token) authentication with secure password hashing (`bcryptjs`).
  - Protected API routes and React route guards.
  - Automatic category seeding (Salary, Freelance, Food, Transportation, Shopping, Utilities, etc.) on new user registration.

- **📊 Dashboard Overview**
  - Real-time summary cards: Total Income, Total Expenses, and Net Balance.
  - Interactive **Monthly Trend** line chart (Income vs Expenses).
  - **Category Breakdown** doughnut chart with color-coded segments.
  - Recent transactions list with quick-access links.

- **💳 Transactions Management**
  - Add, edit, and delete income and expense transactions.
  - Filter transactions by **Type** (Income / Expense), **Month**, and **Year**.
  - Pagination and clean tabular layout with formatted currency (`₹`).

- **🏷️ Categories Management**
  - Custom category creation for both Income and Expenses.
  - Interactive icon picker (20+ emojis/icons) and vibrant color palette selector.
  - Automatic cascade deletion of related transactions when a category is removed.

- **📈 Monthly & Annual Reports**
  - Yearly navigation with annual summary cards (Total Income, Total Expenses, Net Savings, Savings Rate %).
  - Monthly comparison bar chart (Income vs Expense side-by-side).
  - Detailed category breakdown with percentage progress bars.
  - Full 12-month summary table with monthly net calculations.

- **🎨 UI / UX Design System**
  - Dark glassmorphism theme (`Inter` typography, glass cards, radial glowing accents).
  - Fully responsive sidebar navigation with mobile toggle support.

---

## 🏗️ Architecture & Tech Stack

```
├── client/                     # Frontend (React 18 + Vite)
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with JWT interceptor
│   │   ├── components/         # Layout, ProtectedRoute, Navbar/Sidebar
│   │   ├── context/            # AuthContext (state & token management)
│   │   ├── pages/              # Dashboard, Transactions, Categories, Reports, Login, Register
│   │   ├── index.css           # Custom dark glassmorphism CSS design system
│   │   ├── App.jsx             # React Router routing & route guards
│   │   └── main.jsx            # React root mount
│   └── package.json
│
└── server/                     # Backend (Node.js + Express + MongoDB)
    ├── middleware/auth.js      # JWT verification middleware
    ├── models/                 # User, Category, Transaction (Mongoose schemas)
    ├── routes/                 # Auth, Categories, Transactions, Reports
    ├── index.js                # Express app entry & MongoDB connection
    ├── .env                    # Environment variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)

### 1. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=expense_tracker_jwt_secret_key_2024
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string, e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority`)*

### 2. Install Dependencies
From the project root:
```bash
npm run install-all
```
Or separately:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Start the Application

**Start the Backend Server:**
```bash
cd server
npm start
# or for hot reload:
npm run dev
```

**Start the Frontend Client:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` — Register a new account (seeds default categories)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current authenticated user profile

### Transactions (`/api/transactions`)
- `GET /api/transactions` — Query transactions (filters: `type`, `category`, `month`, `year`, `page`, `limit`)
- `POST /api/transactions` — Create a new transaction
- `PUT /api/transactions/:id` — Update an existing transaction
- `DELETE /api/transactions/:id` — Delete a transaction

### Categories (`/api/categories`)
- `GET /api/categories` — Get user categories (filter: `type=income|expense`)
- `POST /api/categories` — Create custom category (`name`, `type`, `color`, `icon`)
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category and cascade remove transactions

### Reports (`/api/reports`)
- `GET /api/reports/monthly?year=YYYY` — 12-month aggregated income/expense totals
- `GET /api/reports/by-category?month=M&year=YYYY&type=expense` — Category breakdown with percentages
