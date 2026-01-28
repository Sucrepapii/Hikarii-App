# Hikari (Light & Clarity)

**Hikari** is a premium, productivity-focused web application designed to bring light and clarity to your tasks and finances. It combines a robust task tracker with an intuitive budget manager, powered by intelligent insights to help you stay on top of your game.

![Hikari Logo](public/logo.png)

## 💡 Why Hikari Stands Out

Hikari isn't just another budget tracker. It is built for **Project-Centric Users** who need clarity on specific goals—whether it's a home renovation, a wedding, or a startup launch.

### 1. Project-Centric Focus

Manage specific goals with dedicated timelines and budgets. No more mixing your "Vacation Fund" with your "Groceries".

### 2. Visual Clarity

A "Light & Clarity" theme that goes beyond aesthetics. Accessible color coding, motivational progress visualization, and a dashboard designed to show status at a glance.

### 3. Smart Defaults & Customization

Intelligent auto-categorization that learns from you. One-click fixes for uncategorized items and flexible rules that adapt to your workflow.

### 4. Actionable Insights

We simply don't say "Spend less". Hikari tells you:

- _"Cancel this subscription you haven't used in 60 days"_
- _"This task is overdue and has cost $X in delays"_
- _"Switch phone carriers to save $240/year based on usage"_

---

## 🌟 Features

### 📝 Task Management

- **Task Organization**: Create, edit, and delete tasks with ease.
- **Categorization**: Group tasks by category (Work, Personal, Health, etc.).
- **Prioritization**: Set priority levels (High, Medium, Low) and due dates.
- **Status Tracking**: Track progress with To Do, In Progress, and Completed statuses.
- **Overdue Alerts**: Automated visual and email indicators for overdue items.

### 💰 Financial Integration

- **Smart Budgeting**: Set monthly, weekly, or daily budget limits.
- **Task-Expense Linking**: Connect expenses to tasks to track project-specific costs (e.g., "Office Renovation").
- **Multi-Currency Support**: Switch between NGN, USD, GBP, and EUR with automatic conversion.
- **Visual Analytics**: Interactive charts showing spending vs. budget in real-time.
- **Filtered Views**: Drill down into financial history by month and year.

### 🧠 Intelligence & Insights

- **Smart Recommendations**: Get AI-driven suggestions on what to tackle next based on priority and deadlines.
- **Predictive Spending**: Forecast end-of-month spending based on current habits.
- **Pattern Recognition**: Detect recurring expenses like subscriptions automatically.
- **Financial Health**: Automated assessment of your spending habits.
- **Notifications**: System-wide alerts for budget thresholds and upcoming deadlines.

### 🔒 Security & Accounts

- **Secure Authentication**: JWT-based auth with secure cookies/headers.
- **Email Verification**: OTP-based email verification for new accounts.
- **Password Recovery**: Secure "Forgot Password" flow with email codes.
- **Data Privacy**: Individual data isolation for every user.

## 🛠️ Tech Stack

**Frontend**

- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom "Hikari" Design System)
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios

**Backend**

- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: MongoDB (via Prisma)
- **Authentication**: JsonWebToken (JWT) & Bcrypt
- **Email Service**: Resend

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas URI)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/hikari.git
    cd hikari
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    cd server
    npm install
    cd ..
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the `server` directory (see [Environment Variables](#environment-variables)).

4.  **Database Setup:**
    Initialize the Prisma client and push the schema to your database.
    ```bash
    # From the root directory
    npm run db:push
    ```

### Running the App

We support a **Monolith** development mode where both frontend and backend run concurrently.

```bash
# From the root directory
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## ⚙️ Environment Variables

Create a file named `.env` in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="mongodb://localhost:27017/hikari"

# Authentication
JWT_SECRET="your_highly_secure_secret_key_here"
JWT_EXPIRES_IN="7d"

# Client URL (for CORS)
CLIENT_URL="http://localhost:5173,http://localhost:5174"

# Email Service (Resend)
RESEND_API_KEY="re_123456789..."
```

## 📦 Project Structure

```
hikari/
├── src/                  # Frontend Source
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route pages (Login, Dashboard, etc.)
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── server/               # Backend Source
│   ├── src/
│   │   ├── controllers/  # API Logic
│   │   ├── models/       # Database Models (Prisma)
│   │   ├── routes/       # API Endpoints
│   │   ├── services/     # External Services (Email)
│   │   └── utils/        # Backend Helpers
│   └── prisma/           # Database Schema
└── public/               # Static Assets (Logo, Favicon)
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
