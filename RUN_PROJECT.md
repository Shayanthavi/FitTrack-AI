# 🚀 How to Run FitTrack AI

## Quick Start (Step-by-Step)

### ✅ Step 1: Setup Database (One-time only)

1. **Open MySQL Command Line or MySQL Workbench**

2. **Copy and run this SQL:**

```sql
CREATE DATABASE IF NOT EXISTS fittrack_db;
USE fittrack_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

### ✅ Step 2: Setup Backend (One-time only)

**Open Terminal/PowerShell #1:**

```powershell
# Navigate to backend
cd d:\Intern\StudentMan\Fitness\backend_fitness

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your MySQL password
notepad .env
```

**Update your `.env` file:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=fittrack_db

JWT_SECRET=fittrack_secret_key_2024
```

---

### ✅ Step 3: Setup Frontend (Already done - lottie-react installed!)

**The frontend is ready to go!** You've already installed the dependencies.

If needed, create `.env` file:

```powershell
cd d:\Intern\StudentMan\Fitness\frontend_fitness
Copy-Item .env.example .env
```

Content should be:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### ✅ Step 4: Run the Application

#### **Terminal 1 - Start Backend:**

```powershell
cd d:\Intern\StudentMan\Fitness\backend_fitness
npm run dev
```

**You should see:**
```
✅ MySQL Database connected successfully
🚀 FitTrack AI Backend running on port 5000
📍 Environment: development
```

#### **Terminal 2 - Start Frontend:**

```powershell
cd d:\Intern\StudentMan\Fitness\frontend_fitness
npm run dev
```

**You should see:**
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

---

### ✅ Step 5: Use the Application

1. **Open browser:** `http://localhost:5173`

2. **Create account:**
   - Click "Get Started"
   - Fill in your details
   - Click "Create Account"

3. **Use dashboard:**
   - Enter your daily metrics
   - View charts
   - Get AI suggestions!

---

## 🎯 Test with Sample Data

Try these values to see AI suggestions change:

**Low Activity Day:**
- Steps: `4000`
- Sleep: `5.5` hours
- Calories: `1600`

**Good Day:**
- Steps: `8500`
- Sleep: `7.5` hours
- Calories: `2000`

**Excellent Day:**
- Steps: `12000`
- Sleep: `8` hours
- Calories: `2100`

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: MySQL connection failed**
- Check MySQL is running
- Verify password in `backend_fitness/.env`
- Ensure database `fittrack_db` exists

**Error: Port 5000 in use**
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Frontend issues?

**Error: Cannot find module**
```powershell
cd frontend_fitness
npm install
```

**Error: Failed to fetch API**
- Ensure backend is running on port 5000
- Check frontend `.env` has correct API URL
- Try restarting both servers

---

## 📱 What You'll See

### 1. Landing Page
- Hero section with animations
- Feature cards
- Get Started / Login buttons

### 2. Dashboard
- 3 animated metric cards (Steps, Sleep, Calories)
- Input form for daily logs
- 2 interactive charts
- "Get AI Suggestions" button

### 3. AI Suggestions
- Overall health score (0-100)
- Category insights (Activity, Sleep, Nutrition)
- Color-coded recommendations
- Actionable tips

---

## ✅ Success Checklist

- [ ] MySQL database created
- [ ] Backend `.env` configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access landing page
- [ ] Can create account
- [ ] Can login
- [ ] Can log daily metrics
- [ ] Can view charts
- [ ] Can get AI suggestions

---

## 🎉 You're All Set!

Your FitTrack AI application is now running!

**Enjoy tracking your fitness journey! 💪📊🏃‍♂️**
