<div align="center">

# CivyxPro

### AI-Powered Resume Builder SaaS

**Build ATS-friendly professional resumes in minutes.**  
AI writing, 5+ templates, multi-currency payments, and instant PDF export — for just $1.

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](https://github.com/Milesnnaji/civyxpro)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Claude AI](https://img.shields.io/badge/AI-Claude%20by%20Anthropic-6C63FF?style=flat-square)](https://anthropic.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## Features

- **AI Resume Writer** — Claude AI generates professional summaries, bullet points, and role-specific descriptions tailored to your target job
- **5+ Premium Templates** — ATS-optimized designs for tech, design, and management roles
- **$1 PDF Export** — Pay once per download via Stripe, Paystack, or Flutterwave
- **Resume Marketplace** — Browse and download expert-crafted resume templates for FAANG, startups, and more
- **Multi-Currency Payments** — USD (Stripe), NGN/Africa (Paystack & Flutterwave) support
- **JWT Authentication** — Secure registration, login, and protected routes
- **Live Preview** — Real-time resume preview as you type
- **Email Notifications** — Transactional emails via Gmail SMTP

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Payments | Stripe · Paystack · Flutterwave |
| AI | Anthropic Claude API |
| PDF | Puppeteer |
| Email | Nodemailer |
| File Upload | Multer |

---

## Project Structure

```
civyxpro/
├── frontend/                  # React app (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   ├── AIModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/             # One file per route
│   │   │   ├── Landing.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Builder.jsx
│   │   │   ├── Templates.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Payments.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   ├── utils/
│   │   │   └── api.js         # Axios instance + all API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                   # Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Payment.js
│   │   └── Template.js
│   ├── middleware/
│   │   └── auth.js            # JWT verify middleware
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── paymentController.js
│   │   ├── templateController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resumes.js
│   │   ├── payments.js
│   │   ├── templates.js
│   │   ├── uploads.js
│   │   └── users.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com) — free tier)
- npm or yarn

---

## Quick Start

### 1. Clone / download the project

```bash
# If using git
git clone https://github.com/yourname/civyxpro.git
cd civyxpro
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB — get free URI from https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/civyxpro

# JWT — any long random string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Anthropic Claude AI — https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# Stripe — https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Paystack — https://dashboard.paystack.com/#/settings/developers
PAYSTACK_SECRET_KEY=sk_test_...

# Flutterwave — https://developer.flutterwave.com
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for CORS + email links)
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Start the frontend:

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/resumes` | List user's resumes | Yes |
| POST | `/api/resumes` | Create resume | Yes |
| PUT | `/api/resumes/:id` | Update resume | Yes |
| DELETE | `/api/resumes/:id` | Delete resume | Yes |
| GET | `/api/resumes/:id/pdf` | Generate PDF | Yes |
| GET | `/api/templates` | List all templates | No |
| POST | `/api/templates` | Upload template (admin) | Yes |
| POST | `/api/payments/stripe` | Create Stripe session | Yes |
| POST | `/api/payments/stripe/webhook` | Stripe webhook | No |
| POST | `/api/payments/paystack` | Init Paystack payment | Yes |
| GET | `/api/payments/paystack/verify/:ref` | Verify Paystack | Yes |
| POST | `/api/payments/flutterwave` | Init Flutterwave payment | Yes |
| GET | `/api/payments/flutterwave/verify` | Verify Flutterwave | Yes |
| GET | `/api/payments/history` | User payment history | Yes |
| GET | `/api/users/profile` | Get profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/uploads/resume` | Upload premium resume | Yes |

---

## Payment Flow

```
User clicks "Download" →
  POST /api/payments/{provider}/init →
    Returns payment URL or client secret →
      User completes payment on provider →
        Webhook / verify endpoint called →
          Payment saved to DB →
            PDF download unlocked
```

- **Stripe**: Uses Checkout Sessions + webhook for confirmation
- **Paystack**: Initialize → redirect → verify by reference
- **Flutterwave**: Initialize → redirect → verify by transaction ID

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Push to GitHub, import repo in vercel.com
# Set VITE_API_URL env var to your backend URL
```

### Backend → Render

1. Go to [render.com](https://render.com), create a new Web Service
2. Connect your GitHub repo, set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env`

### Backend → VPS (Ubuntu)

```bash
# Install Node + PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Run the app
cd /var/www/civyxpro/backend
npm install --production
pm2 start server.js --name civyxpro
pm2 save
pm2 startup
```

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) — free M0 cluster |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `PAYSTACK_SECRET_KEY` | [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developers) |
| `FLUTTERWAVE_SECRET_KEY` | [developer.flutterwave.com](https://developer.flutterwave.com) |
| `EMAIL_PASS` | Gmail: use App Password, not your real password |

---

## Features Checklist

- [x] JWT Authentication (register / login / protected routes)
- [x] Resume builder with live preview
- [x] 5 resume templates (2 free, 3 premium)
- [x] AI writing assistance (Claude API)
- [x] PDF generation (Puppeteer)
- [x] Stripe payments (international)
- [x] Paystack payments (Nigeria)
- [x] Flutterwave payments (Africa)
- [x] Premium resume marketplace
- [x] Payment history
- [x] File upload (Multer)
- [x] Email notifications (Nodemailer)
- [x] User profile management
- [x] Mobile responsive

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — free to use, modify, and deploy commercially.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/Milesnnaji">Milesnnaji</a>
</div>
