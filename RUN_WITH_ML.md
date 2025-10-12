# 🚀 Run FitTrack AI with Machine Learning

Complete guide to run the full application with ML-powered AI suggestions.

---

## 📋 Prerequisites

- ✅ MySQL installed and running
- ✅ Node.js installed
- ✅ Python 3.8+ installed
- ✅ Database created (fittrack_db)
- ✅ Dataset ready (CSV with steps, sleep_hours, calories)

---

## 🎯 Quick Start (5 Steps)

### **Step 1: Setup Python ML Service** (One-time)

```powershell
# Install Python dependencies
cd d:\Intern\StudentMan\Fitness\ml_service
pip install -r requirements.txt
```

### **Step 2: Train the ML Model** (One-time)

```powershell
# Option A: Use the batch file
cd d:\Intern\StudentMan\Fitness
.\train_ml_model.bat
# Then enter: C:\Users\Admin\Downloads\sample fitbit\your_file.csv

# Option B: Direct command
cd ml_service
python train_model.py "C:\Users\Admin\Downloads\sample fitbit\your_file.csv"
```

**Wait for training to complete** (you'll see "✅ Training completed successfully!")

### **Step 3: Start ML Service** (Every time - Terminal 1)

```powershell
cd d:\Intern\StudentMan\Fitness
.\start_ml_service.bat
```

**Expected output:**
```
✅ Model loaded successfully
🚀 FitTrack AI - ML Service Starting
📍 Running on: http://localhost:5001
```

**Keep this terminal open!**

### **Step 4: Start Backend** (Every time - Terminal 2)

```powershell
cd d:\Intern\StudentMan\Fitness\backend_fitness

# First time only:
npm install
Copy-Item .env.example .env
notepad .env  # Update DB_PASSWORD and add ML_SERVICE_URL=http://localhost:5001

# Every time:
npm run dev
```

**Expected output:**
```
✅ MySQL Database connected successfully
🚀 FitTrack AI Backend running on port 5000
```

### **Step 5: Start Frontend** (Every time - Terminal 3)

```powershell
cd d:\Intern\StudentMan\Fitness\frontend_fitness
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready
➜ Local: http://localhost:5173/
```

---

## 🎉 You're Ready!

Open browser: **http://localhost:5173**

1. Create account / Login
2. Log your daily metrics
3. Click "Get AI Suggestions"
4. **See ML-powered predictions!** 🤖

---

## 🔍 Verify ML is Working

### **Method 1: Check Backend Console**

When you click "Get AI Suggestions", backend should show:
```
✅ Using ML predictions (Random Forest)
```

NOT:
```
⚠️ ML service unavailable, using rule-based fallback
```

### **Method 2: Check ML Service Health**

Visit: **http://localhost:5001/**

Should show:
```json
{
  "model_loaded": true,
  "model_info": {
    "model_name": "Random Forest"
  }
}
```

### **Method 3: Check Frontend Response**

Open browser console (F12), look for API response:
```javascript
{
  "model_used": "Random Forest",  // ✅ ML is working!
  "suggestions": [...]
}
```

---

## 📊 System Architecture

```
┌─────────────┐
│   Browser   │  http://localhost:5173
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│  React Frontend │
└──────┬──────────┘
       │
       ↓
┌─────────────────────┐
│  Node.js Backend    │  http://localhost:5000
│   (Express API)     │
└──────┬──────────────┘
       │
       ├─────────────────────────┬───────────────────┐
       ↓                         ↓                   ↓
┌──────────────┐     ┌───────────────────┐   ┌──────────────┐
│    MySQL     │     │  ML Service Flask │   │  Fallback    │
│   Database   │     │  http://localhost │   │  Rule-Based  │
└──────────────┘     │       :5001       │   │     AI       │
                     └───────────────────┘   └──────────────┘
                              │
                              ↓
                     ┌───────────────────┐
                     │  Trained ML Model │
                     │  (Random Forest)  │
                     └───────────────────┘
```

---

## 🛠️ Running Order (Important!)

**Always start in this order:**

1. **MySQL** (should already be running)
2. **ML Service** (Terminal 1) - `start_ml_service.bat`
3. **Backend** (Terminal 2) - `cd backend_fitness && npm run dev`
4. **Frontend** (Terminal 3) - `cd frontend_fitness && npm run dev`

---

## 🐛 Common Issues & Solutions

### **Issue 1: Backend says "ML service unavailable"**

**Solution:**
```powershell
# Make sure ML service is running first!
cd d:\Intern\StudentMan\Fitness
.\start_ml_service.bat
```

### **Issue 2: ML Service says "No model loaded"**

**Solution:**
```powershell
# Train the model first!
cd ml_service
python train_model.py "C:\path\to\your\data.csv"
```

### **Issue 3: Training fails with "Missing columns"**

**Solution:**
- Check your CSV has required columns
- Column names can vary (steps, TotalSteps, etc.)
- See `ML_INTEGRATION_GUIDE.md` for details

### **Issue 4: Port 5001 already in use**

**Solution:**
```powershell
# Kill the process using port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or change port in ml_service/app.py (line ~216)
```

### **Issue 5: Python not found**

**Solution:**
```powershell
# Install Python from python.org
# Then:
python --version  # Should show Python 3.8+
```

---

## 📈 Testing with Sample Data

If you don't have real data yet, create a quick sample:

**sample_data.csv:**
```csv
steps,sleep_hours,calories
8000,7.5,2000
5000,6.0,1800
12000,8.0,2200
4500,5.5,1700
9500,7.0,2100
7000,7.5,1950
11000,8.5,2300
6000,6.5,1850
10500,7.8,2150
5500,6.2,1800
8500,7.2,2050
7500,7.0,1980
9000,7.5,2100
6500,6.8,1900
10000,8.0,2180
```

Save and train:
```powershell
python train_model.py sample_data.csv
```

---

## ✅ Success Checklist

- [ ] Python dependencies installed
- [ ] ML model trained successfully
- [ ] ML service running on port 5001
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Backend console shows "Using ML predictions"
- [ ] Can log health metrics
- [ ] Can get AI suggestions
- [ ] Suggestions show model name (e.g., "Random Forest")

---

## 🎓 What You've Achieved

✅ **Full-Stack Application** (React + Node.js + MySQL)  
✅ **Machine Learning Integration** (Python + Flask + scikit-learn)  
✅ **3 ML Models** (Decision Tree, Random Forest, KNN)  
✅ **Automatic Model Selection** (Best performing model)  
✅ **Fallback System** (Rule-based if ML unavailable)  
✅ **RESTful APIs** (Backend ↔ ML Service)  
✅ **Real-time Predictions** (Personalized health suggestions)  
✅ **Modern UI/UX** (Animations, charts, modals)  

---

## 📚 Further Reading

- **ML_INTEGRATION_GUIDE.md** - Detailed ML service docs
- **ml_service/README.md** - ML API reference
- **README.md** - Main project documentation
- **QUICK_START.md** - Basic setup without ML

---

## 🚀 Next Steps

1. ✅ Collect more health data (100+ samples)
2. ✅ Retrain model monthly for better accuracy
3. ✅ Add more features (age, weight, heart rate)
4. ✅ Build admin panel for model management
5. ✅ Deploy to production (Heroku, AWS, etc.)

---

**🎊 Congratulations! You're running a real AI-powered health app!** 🏃‍♂️💪🤖
