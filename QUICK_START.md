# 🚀 Quick Start Guide - FitTrack AI

Follow these steps to get FitTrack AI running on your machine in **5 minutes**!

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ **Node.js** installed (check: `node -v`)
- ✅ **MySQL** installed and running (check: `mysql --version`)
- ✅ **npm** or **yarn** installed

---

## 📋 Step-by-Step Setup

### Step 1: Database Setup (2 minutes)

1. **Open MySQL Command Line or MySQL Workbench**

2. **Run these commands:**

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS fittrack_db;
USE fittrack_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create health_logs table
CREATE TABLE IF NOT EXISTS health_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  steps INT NOT NULL DEFAULT 0,
  sleep_hours DECIMAL(4,2) NOT NULL DEFAULT 0,
  calories INT NOT NULL DEFAULT 0,
  log_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_date (user_id, log_date),
  INDEX idx_user_date (user_id, log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ai_suggestions table (optional)
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  suggestions TEXT NOT NULL,
  based_on_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

✅ **Database is ready!**

---

### Step 2: Backend Setup (1 minute)

**Open Terminal/PowerShell #1:**

```powershell
# Navigate to backend
cd d:\Intern\StudentMan\Fitness\backend

# Install dependencies (first time only)
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file with your MySQL password
# Update DB_PASSWORD=your_mysql_password
notepad .env

# Start backend server
npm run dev
```

✅ **Backend running on http://localhost:5000**

---

### Step 3: Frontend Setup (1 minute)

**Open Terminal/PowerShell #2 (NEW WINDOW):**

```powershell
# Navigate to frontend
cd d:\Intern\StudentMan\Fitness\frontend_fitness

# Install dependencies (first time only)
npm install

# Install lottie-react (if not installed)
npm install lottie-react

# Create .env file
Copy-Item .env.example .env

# Start frontend server
npm run dev
```

✅ **Frontend running on http://localhost:5173**

---

### Step 4: Test the Application (1 minute)

1. **Open browser:** Go to `http://localhost:5173`

2. **Create account:**
   - Click "Get Started"
   - Enter your details
   - Click "Create Account"

3. **Use the dashboard:**
   - Log today's metrics (steps, sleep, calories)
   - Click "Get AI Suggestions"
   - View your health insights!

---

## 🎯 Quick Test Data

Try these realistic values:

**Day 1 - Low Activity:**
- Steps: `4500`
- Sleep: `6` hours
- Calories: `1800`

**Day 2 - Moderate Activity:**
- Steps: `7500`
- Sleep: `7.5` hours
- Calories: `2100`

**Day 3 - High Activity:**
- Steps: `11000`
- Sleep: `8` hours
- Calories: `2300`

Watch the AI suggestions change based on your metrics! 🎉

---

## 🐛 Common Issues & Fixes

### Issue 1: Backend won't start
**Error:** `Access denied for user 'root'@'localhost'`

**Fix:**
```powershell
# Edit backend/.env file
# Update: DB_PASSWORD=your_actual_mysql_password
```

---

### Issue 2: Frontend can't connect to backend
**Error:** `Network Error` or `Failed to fetch`

**Fix:**
1. Ensure backend is running on port 5000
2. Check frontend/.env has: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend dev server

---

### Issue 3: Port already in use
**Error:** `Port 5000 is already in use`

**Fix:**
```powershell
# Option 1: Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Option 2: Change port in backend/.env
# Update: PORT=5001
# Then update frontend/.env: VITE_API_URL=http://localhost:5001/api
```

---

## 📱 What You Should See

### Landing Page:
- Modern hero section with animations
- "Get Started" and "Sign In" buttons
- Feature cards showcasing app capabilities

### Dashboard:
- Three animated metric cards (Steps, Sleep, Calories)
- Input form to log daily metrics
- Two charts showing trends
- "Get AI Suggestions" button

### AI Suggestions Modal:
- Overall health score (0-100)
- Category-specific insights (Activity, Sleep, Nutrition)
- Color-coded recommendations (Success/Warning/Urgent)
- Actionable tips

---

## 🎓 Next Steps

After successful setup:

1. ✅ Log metrics for 3-5 days
2. ✅ Watch charts populate with data
3. ✅ Get AI suggestions regularly
4. ✅ Track your health improvements!

---

## 🆘 Need Help?

**Check if servers are running:**
```powershell
# Backend should show:
✅ MySQL Database connected successfully
🚀 FitTrack AI Backend running on port 5000

# Frontend should show:
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

**Test backend API manually:**
```powershell
# Open browser and go to:
http://localhost:5000

# Should see:
{
  "message": "FitTrack AI Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

---

## 🎉 Success!

If you see the landing page with animations, you're all set! 

**Now:**
1. Create your account
2. Start tracking your health
3. Get personalized AI insights
4. Transform your fitness journey! 💪

---

**Happy Tracking! 🏃‍♂️📊💡**
