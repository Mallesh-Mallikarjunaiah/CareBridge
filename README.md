# 🌉 CareBridge — AI-Powered Patient Discharge Summary Simplifier

> *"Bridging the gap between medical jargon and patient understanding"*

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-green.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0-purple.svg)]()

---

## 📌 Problem Statement

Every year, millions of patients are discharged from hospitals with complex medical summaries filled with clinical terminology, abbreviations, and dense instructions they struggle to understand. Studies show that **nearly 80% of patients** forget or misunderstand their discharge instructions, leading to medication errors, missed follow-ups, and preventable hospital readmissions.

**CareBridge** solves this by using Generative AI (Google Gemini) to transform complex medical discharge summaries into clear, patient-friendly language — empowering patients, caregivers, and families to take control of their recovery journey.

---

## 💡 What is CareBridge?

CareBridge is a full-stack web application that:

- **Simplifies** complex discharge summaries into plain, easy-to-understand language
- **Extracts** medications, appointments, warnings, and care instructions automatically
- **Tracks** patient recovery with an interactive timeline and daily check-ins
- **Generates** printable care cheat sheets with medication schedules
- **Provides** an AI chat assistant for post-discharge questions
- **Alerts** patients about concerning symptoms that need medical attention

---

## ✨ Key Features

### 🔐 User Authentication (JWT)
Custom JWT-based authentication system with user registration, login, and protected routes. Passwords are securely hashed with bcrypt.

### 📄 Document Upload & AI Extraction
Upload discharge summaries (PDF, images) and let Google Gemini AI extract structured data — medications, appointments, warnings, and instructions — with accuracy verification.

### 🏠 Recovery Dashboard
A personalized overview showing upcoming appointments, active medications, wound care tasks, and an AI chat widget — all in one place.

### 📅 Recovery Timeline
Interactive recovery phases with checkable tasks, progress tracking, and helpful tips for each stage of recovery.

### ✅ Daily Check-In
Log daily mood, pain levels, symptoms, and medication adherence. AI analyzes symptoms and flags concerning patterns for early intervention.

### 📋 Care Cheat Sheet
A simplified, printable one-page summary of medications, appointments, warnings, emergency signs, and daily schedule. Print or save as PDF.

### 💬 AI Chat Assistant (RAG)
Ask questions about your discharge documents in plain language. Powered by Gemini AI with retrieval-augmented generation (RAG) for accurate, context-aware answers.

### 🔊 Text-to-Speech
AI responses can be converted to audio for accessibility — especially helpful for elderly patients or those with visual impairments.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18+ | UI framework |
| Vite 7 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first CSS styling |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client for API calls |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Backend language |
| FastAPI | High-performance API framework |
| Uvicorn | ASGI server |
| Pydantic | Data validation and schemas |
| bcrypt | Password hashing |
| python-jose | JWT token management |

### AI / Machine Learning
| Technology | Purpose |
|---|---|
| Google Gemini 2.0 Flash | Core LLM for document extraction and chat |
| Vertex AI | Google Cloud AI platform |
| google-genai | Gemini API client |

### Database & Cloud
| Technology | Purpose |
|---|---|
| Firebase Firestore | NoSQL database for users and patient data |
| Firebase Admin SDK | Server-side Firebase operations |
| Google Cloud Storage | File storage for uploaded documents |

### DevOps
| Technology | Purpose |
|---|---|
| Git & GitHub | Version control |
| GitHub Actions | CI/CD pipeline |
| Docker | Containerization |

---

## 📂 Project Structure

```
CareBridge/
├── frontend/                    # React + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentsList.jsx
│   │   │   ├── ChatWidget.jsx
│   │   │   ├── ExtractedData.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MedicationsList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── WoundCareTasks.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Auth.jsx           # Login & Signup
│   │   │   ├── Upload.jsx         # Document upload
│   │   │   ├── Dashboard.jsx      # Recovery overview
│   │   │   ├── Timeline.jsx       # Recovery timeline
│   │   │   ├── CheckIn.jsx        # Daily check-in
│   │   │   ├── CheatSheet.jsx     # Printable care summary
│   │   │   └── ChatPage.jsx       # AI chat assistant
│   │   ├── utils/
│   │   │   └── api.js             # Axios config with JWT
│   │   └── App.jsx                # Routing
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                       # Python FastAPI
│   ├── app/
│   │   ├── main.py                # FastAPI entry point
│   │   ├── config.py              # Environment settings
│   │   ├── middleware/
│   │   │   └── auth_middleware.py  # JWT route protection
│   │   ├── routers/
│   │   │   ├── auth.py            # Register + Login endpoints
│   │   │   ├── documents.py       # Upload + Gemini parsing
│   │   │   ├── chat.py            # RAG chat endpoint
│   │   │   ├── checkins.py        # Patient check-in logic
│   │   │   ├── alerts.py          # Alert triage system
│   │   │   ├── calendar.py        # Google Calendar sync
│   │   │   └── cheatsheet.py      # PDF generation
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic data models
│   │   └── services/
│   │       ├── auth_service.py    # Password hashing + JWT
│   │       ├── gemini.py          # All Gemini AI calls
│   │       └── firebase.py        # Firestore operations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                       # Environment variables (not committed)
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20+
- Git
- Google Cloud account (for Gemini API)
- Firebase project

### 1. Clone the Repository

```bash
git clone https://github.com/Mallesh-Mallikarjunaiah/CareBridge.git
cd CareBridge
```

### 2. Set Up the Backend

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section below)

# Run the backend
uvicorn app.main:app --reload --port 8000
```

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run the frontend
npm run dev
```

### 4. Open in Browser

```
Frontend:  http://localhost:5173
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
```

---

## 🔐 Environment Variables

Create a `backend/.env` file with:

```env
# App Settings
APP_NAME=CareBridge
APP_ENV=development
APP_PORT=8000
CORS_ORIGINS=http://localhost:5173

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-here         # Generate: python -c "import secrets; print(secrets.token_hex(32))"
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key          # Get from: https://aistudio.google.com/apikey

# Google Cloud (for Vertex AI)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT token |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/update` | Update user profile |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload/{patient_id}` | Upload & extract discharge document |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message to AI assistant |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API status check |
| GET | `/health` | Health check |

---

## 📸 Screenshots

| Login Page | Dashboard | Timeline |
|---|---|---|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Timeline](docs/screenshots/timeline.png) |

| Check-In | Cheat Sheet | AI Chat |
|---|---|---|
| ![CheckIn](docs/screenshots/checkin.png) | ![CheatSheet](docs/screenshots/cheatsheet.png) | ![Chat](docs/screenshots/chat.png) |

---

## 🔮 Future Roadmap

- [ ] Multi-language translation for discharge summaries
- [ ] SMS/WhatsApp medication reminders
- [ ] Integration with Electronic Health Records (EHR)
- [ ] Wearable device integration for vitals monitoring
- [ ] Caregiver collaboration dashboard
- [ ] HIPAA compliance and end-to-end encryption
- [ ] Voice input for elderly patients
- [ ] Google Calendar sync for appointments

---

## 👥 Team

| Name | Role |
|---|---|
| Mallesh M | Backend Developer & Auth System |
| Team Member 2 | AI/ML & Gemini Integration |
| Team Member 3 | Frontend Developer |
| Team Member 4 | Frontend Developer |
| Team Member 5 | UI/UX Designer & Tester |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

```
feat:     New feature
fix:      Bug fix
style:    UI/CSS changes
docs:     Documentation
chore:    Config/setup changes
refactor: Code restructuring
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful document understanding
- Firebase for real-time database and authentication infrastructure
- The healthcare professionals who inspired this project
- All patients and caregivers who deserve better communication

---

<div align="center">

**Built with ❤️ for better healthcare communication**

*CareBridge — Because understanding is the first step to healing*

🌉

</div>
