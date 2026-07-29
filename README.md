# 🏙️ Smart Civic Issue System

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.8.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> A modern, full-stack web application designed to bridge the gap between citizens and municipal authorities. Citizens can report local infrastructure, sanitation, and safety issues with media evidence and geolocation, while administrative teams manage, track, and resolve reports through an interactive analytics dashboard.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### 📢 Citizen Reporting Portal
- **Structured Categorization**: Report issues across six major municipal categories:
  - 🚗 *Road & Transport* (Potholes, cracks, waterlogging, broken speed breakers)
  - 🗑️ *Sanitation & Waste* (Garbage overflow, illegal dumping, blocked sewage)
  - ⚡ *Electricity & Street Infrastructure* (Faulty streetlights, broken poles, hanging wires)
  - 💧 *Water Supply* (Pipeline leaks, water quality, pressure issues)
  - 🌳 *Public Safety & Environment* (Fallen trees blocking roads, stray animals)
  - 🏢 *Public Infrastructure* (Damaged bus stops, park maintenance, broken public assets)
- **Automatic Geolocation**: Detect current latitude & longitude or type manual addresses.
- **Image Attachments**: Upload photos with live preview before submission.
- **Instant Feedback**: Real-time validation and report submission confirmation modal.

### 🛡️ Community & Admin Security
- **Firebase Authentication**: Secure email & password authentication for community members and municipal administrators.
- **Route Protection**: Custom React Router guards preventing unauthorized access to submission forms or administrative controls.

### 📊 Administrative Dashboard & Analytics
- **Live Metrics**: Total reports, pending queue, active investigations, and solved issue counters with resolution rate percentages.
- **Interactive Visualizations**: Dynamic SVG Donut Chart for status distribution and Category Breakdown bar chart.
- **Real-Time Data Feed**: Filter reports by status (*Pending*, *In Progress*, *Solved*) or category; search by location, reporter name, or issue description.
- **Detailed Inspection Drawer**: View full complaint details, uploaded evidence photo zoom, status update workflow, and record deletion.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-based UI with fast HMR bundling |
| **Routing** | React Router v6 | Client-side routing with guarded authentication routes |
| **Icons & UI** | Lucide React, Custom CSS | Modern icon system & CSS design tokens |
| **Backend API** | Node.js, Express.js | Serverless-ready RESTful API server |
| **Database** | Firebase Firestore | Cloud NoSQL database for realtime data storage |
| **Authentication** | Firebase Auth | Secure user identity management |
| **File Handling** | Multer | Multipart memory buffer processing for uploads |
| **Deployment** | Vercel | Monorepo deployment for frontend static assets & serverless functions |

---

## 🏗️ System Architecture

```plain
[ Community Member ] ──> [ React 18 Frontend (Vite) ] ──> [ Firebase Auth ]
                                  │
                                  ▼
                         [ Express REST API ]
                                  │
                        [ Firebase Admin SDK ]
                                  │
                                  ▼
                       [ Cloud Firestore DB ]
```

---

## 📂 Repository Structure

```plain
Smart-Civic-Issue-System/
├── api/                        # Express Backend & Serverless API
│   ├── middleware/             # Express middlewares (Auth, etc.)
│   │   └── auth.js             # Firebase Token verification middleware
│   ├── models/                 # Reserved for data schemas
│   ├── routes/                 # Express API routes
│   │   └── api.js              # REST endpoints (/api/reports)
│   ├── firebase.js             # Firebase Admin SDK initialization
│   ├── index.js                # Express app entry point
│   ├── package.json            # Backend dependencies
│   └── serviceAccountKey.json.example  # Firebase Admin credential template
├── public/                     # Static public assets & brand icons
│   └── tn-logo.png             # Application logo asset
├── src/                        # React Frontend Source Code
│   ├── assets/                 # SVGs and dynamic assets
│   ├── components/             # Reusable UI Components
│   │   └── Navbar.jsx          # Header navigation bar with role detection
│   ├── pages/                  # Top-level Page Views
│   │   ├── AdminDashboard.jsx  # Admin analytics & issue management
│   │   ├── AdminLogin.jsx      # Portal login for administrators
│   │   ├── PublicForm.jsx      # Citizen issue report submission form
│   │   └── PublicLogin.jsx     # Portal login for community members
│   ├── App.css                 # Component specific styles
│   ├── App.jsx                 # Main application routes & auth guards
│   ├── firebaseConfig.js       # Client Firebase SDK setup
│   ├── index.css               # Design system & CSS custom properties
│   └── main.jsx                # React root mount point
├── .env.example                # Environment variables template
├── .gitignore                  # Git exclusion configuration
├── eslint.config.js            # Unified ESLint configuration
├── index.html                  # HTML template root
├── package.json                # Main project scripts & dependencies
├── vercel.json                 # Vercel monorepo deployment manifest
└── vite.config.js              # Vite bundler setup
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mugilan-md/Smart-Civic-Issue-System.git
   cd Smart-Civic-Issue-System
   ```

2. **Install frontend & backend dependencies**:
   ```bash
   npm install
   ```

### Environment Setup

1. **Root `.env` Configuration**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Set your local backend endpoint:
   ```env
   VITE_API_URL=http://localhost:5000
   PORT=5000
   ```

2. **Firebase Admin Credentials (`serviceAccountKey.json`)**:
   - Obtain a Firebase Service Account key JSON file from the [Firebase Console](https://console.firebase.google.com/) under **Project Settings > Service Accounts**.
   - Copy `api/serviceAccountKey.json.example` to `api/serviceAccountKey.json` and paste your credentials:
     ```json
     {
       "type": "service_account",
       "project_id": "your-firebase-project-id",
       "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n",
       "client_email": "firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"
     }
     ```

### Running the Application

You can start both the React frontend and Express backend concurrently:

```bash
npm run start-all
```

Or run them individually in separate terminals:

- **Start Frontend (Vite Dev Server)**:
  ```bash
  npm run dev
  # Runs on http://localhost:5173
  ```

- **Start Backend API Server**:
  ```bash
  npm run backend
  # Runs on http://localhost:5000
  ```

---

## 📡 API Reference

The backend exposes the following REST API endpoints under `/api`:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Health check endpoint returning API status | ❌ |
| `POST` | `/api/reports` | Submit a new civic issue report (multipart image support) | ✅ Bearer |
| `GET` | `/api/reports` | Retrieve list of all reported civic issues (newest first) | ✅ Bearer |
| `PUT` | `/api/reports/:id/status` | Update issue status (`Pending` \| `In Progress` \| `Solved`) | ✅ Bearer |
| `DELETE` | `/api/reports/:id` | Permanently remove an issue report record | ✅ Bearer |

---

## ☁️ Deployment

This repository is optimized for one-click deployment on **Vercel**.

1. Import your repository into **Vercel**.
2. Set the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure Environment Variables in Vercel settings:
   - `FIREBASE_SERVICE_ACCOUNT`: Copy the entire contents of your `serviceAccountKey.json` file as a single-line JSON string.
4. Deploy! Vercel automatically routes static frontend assets and `/api` serverless functions as defined in [`vercel.json`](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/project%201/vercel.json).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ for Smart Civic Governance.
</p>
