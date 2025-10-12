# 🤖 ML Integration Guide - FitTrack AI

Complete guide to set up and use the Machine Learning service for intelligent health predictions.

---

## 📋 Quick Overview

The ML service replaces the simple rule-based AI with trained machine learning models that learn from real data patterns.

**Architecture:**
```
Frontend → Backend (Node.js) → ML Service (Python Flask) → Trained ML Model
                              ↓ (fallback if ML unavailable)
                        Rule-Based Logic
```

---

## 🚀 Step-by-Step Setup

### **Step 1: Install Python Dependencies**

```powershell
cd d:\Intern\StudentMan\Fitness\ml_service
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed flask-3.0.0 pandas-2.1.4 scikit-learn-1.3.2 ...
```

---

### **Step 2: Prepare Your Dataset**

#### **Option A: Use Your Fitbit Data**

Your CSV from `C:\Users\Admin\Downloads\sample fitbit\` should have columns like:
- Steps (TotalSteps, steps, step_count, etc.)
- Sleep Hours (SleepHours, sleep, sleep_time, etc.)
- Calories (Calories, CaloriesBurned, total_calories, etc.)

**Example data.csv:**
```csv
TotalSteps,SleepHours,Calories
8547,7.5,2100
5234,6.0,1850
11234,8.2,2300
4567,5.5,1750
9876,7.8,2150
...
```

#### **Option B: Create Sample Dataset**

If you don't have real data yet, create a sample CSV:

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
```

Save as `sample_health_data.csv`

---

### **Step 3: Train the ML Model**

#### **Method 1: Using Command Line (Fastest)**

```powershell
cd d:\Intern\StudentMan\Fitness\ml_service
python train_model.py "C:\Users\Admin\Downloads\sample fitbit\your_file.csv"
```

**Output:**
```
============================================================
🏋️ FitTrack AI - ML Model Training
============================================================
📂 Loading data from: C:\Users\Admin\Downloads\sample fitbit\your_file.csv
✅ Data loaded: 365 rows
📊 Columns: ['totalsteps', 'sleephours', 'calories']
✅ Data prepared: 362 samples
📊 Features: ['steps', 'sleep_hours', 'calories']
📈 Target range: 10.00 - 100.00

🔬 Training models...

Training Decision Tree...
  ✓ RMSE: 5.2341
  ✓ MAE: 3.4521
  ✓ R²: 0.8934
  ✓ CV Score: 0.8712

Training Random Forest...
  ✓ RMSE: 4.1234
  ✓ MAE: 2.9876
  ✓ R²: 0.9312
  ✓ CV Score: 0.9145

Training K-Nearest Neighbors...
  ✓ RMSE: 5.8765
  ✓ MAE: 4.1234
  ✓ R²: 0.8567
  ✓ CV Score: 0.8423

🏆 Best Model: Random Forest
   R² Score: 0.9312

✅ Model saved:
   📁 models/health_model.pkl
   📁 models/scaler.pkl
   📁 models/model_info.json

============================================================
✅ Training completed successfully!
============================================================
```

#### **Method 2: Using Flask API with File Upload**

1. **Start Flask service:**
```powershell
cd d:\Intern\StudentMan\Fitness\ml_service
python app.py
```

2. **Upload CSV via Postman or curl:**
```powershell
curl -X POST http://localhost:5001/train ^
  -F "file=@C:\Users\Admin\Downloads\sample fitbit\your_file.csv"
```

3. **Or use the frontend** (we can add an admin page later)

---

### **Step 4: Start the ML Service**

```powershell
cd d:\Intern\StudentMan\Fitness\ml_service
python app.py
```

**Expected output:**
```
✅ Model loaded successfully

============================================================
🚀 FitTrack AI - ML Service Starting
============================================================
📍 Running on: http://localhost:5001
============================================================

 * Serving Flask app 'app'
 * Running on http://0.0.0.0:5001
```

**Keep this terminal open!**

---

### **Step 5: Update Backend Configuration**

1. **Open backend `.env` file:**
```powershell
cd d:\Intern\StudentMan\Fitness\backend_fitness
notepad .env
```

2. **Add ML service URL:**
```env
ML_SERVICE_URL=http://localhost:5001
```

3. **Install axios if not already:**
```powershell
npm install
```

---

### **Step 6: Start Backend & Frontend**

#### **Terminal 1: Backend**
```powershell
cd d:\Intern\StudentMan\Fitness\backend_fitness
npm run dev
```

#### **Terminal 2: Frontend**
```powershell
cd d:\Intern\StudentMan\Fitness\frontend_fitness
npm run dev
```

#### **Terminal 3: ML Service** (already running from Step 4)

---

## ✅ Testing the Integration

### **Test 1: Check ML Service**

Visit: `http://localhost:5001/`

Should see:
```json
{
  "message": "FitTrack AI - ML Service",
  "status": "running",
  "model_loaded": true,
  "model_info": {
    "model_name": "Random Forest",
    "features": ["steps", "sleep_hours", "calories"]
  }
}
```

### **Test 2: Get ML Prediction**

```powershell
curl -X POST http://localhost:5001/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"steps\":8000,\"sleep_hours\":7.5,\"calories\":2000}"
```

### **Test 3: Full Flow from Frontend**

1. Open browser: `http://localhost:5173`
2. Login to your account
3. Add today's metrics
4. Click "Get AI Suggestions"
5. You should see: **"Model Used: Random Forest"** in console

---

## 🎯 How It Works

### **1. User Logs Health Data**
```
Frontend → Backend → MySQL Database
```

### **2. User Requests AI Suggestions**
```
Frontend (Dashboard) 
  ↓
Backend (/api/ai/suggestion)
  ↓
ML Service (POST /predict)
  ↓
Trained ML Model
  ↓
Health Score + Suggestions
  ↓
Backend → Frontend (Modal Display)
```

### **3. Fallback Mechanism**
```
If ML Service is unavailable:
  Backend automatically uses rule-based logic
  
No frontend changes needed!
```

---

## 📊 Understanding the Models

### **Decision Tree**
- Fast, interpretable
- Good for understanding feature importance
- Can overfit with deep trees

### **Random Forest** ⭐ (Usually Best)
- Ensemble of decision trees
- More accurate and robust
- Less prone to overfitting
- Best balance of accuracy and speed

### **K-Nearest Neighbors (KNN)**
- Simple, instance-based learning
- Good for small datasets
- Can be slow with large data

---

## 🔄 Retraining the Model

### **When to Retrain:**
- Added more health data (50+ new records)
- Model predictions seem off
- Want to improve accuracy
- Every few months

### **How to Retrain:**

1. Export updated data from database:
```sql
SELECT steps, sleep_hours, calories 
FROM health_logs 
INTO OUTFILE 'updated_data.csv';
```

2. Train new model:
```powershell
python train_model.py "path/to/updated_data.csv"
```

3. Restart ML service (automatically loads new model)

---

## 🐛 Troubleshooting

### **Backend says: "ML service unavailable, using rule-based fallback"**
- ✅ Check if ML service is running on port 5001
- ✅ Check `ML_SERVICE_URL` in backend `.env`
- ✅ Check no firewall blocking port 5001

### **ML Service: "No model loaded"**
- ✅ Train the model first: `python train_model.py your_data.csv`
- ✅ Check `models/` folder has `.pkl` files
- ✅ Restart the ML service

### **Training Error: "Missing required columns"**
- ✅ Check CSV has: steps, sleep_hours, calories
- ✅ Column names can vary (TotalSteps, Sleep, etc.)
- ✅ See train_model.py for supported column names

### **Model Accuracy is Low (R² < 0.70)**
- ✅ Need more training data (100+ samples ideal)
- ✅ Check for data quality issues
- ✅ Remove obvious outliers
- ✅ Ensure data is realistic

---

## 📈 Monitoring Model Performance

### **Check Model Info:**
```powershell
curl http://localhost:5001/model/info
```

### **Backend Logs:**
```
✅ Using ML predictions (Random Forest)
```
OR
```
⚠️ ML service unavailable, using rule-based fallback
```

### **Frontend:**
- Open browser console
- Look for "Model Used: ..." in API responses

---

## 🎉 Success Criteria

✅ ML service running on port 5001  
✅ Model trained with R² > 0.85  
✅ Backend can connect to ML service  
✅ Frontend shows ML-powered suggestions  
✅ Health score predictions are realistic (0-100)  
✅ Suggestions are personalized and relevant  

---

## 🚀 Next Steps (Optional Enhancements)

1. **Admin Panel**: Add UI to upload CSV and retrain model
2. **Model Versioning**: Keep track of model versions
3. **A/B Testing**: Compare ML vs rule-based performance
4. **More Features**: Add age, weight, heart rate, etc.
5. **Deep Learning**: Try neural networks for better accuracy
6. **Real-time Learning**: Update model with new user data

---

## 📚 Key Files

```
ml_service/
├── train_model.py          # Training script
├── app.py                  # Flask API
├── requirements.txt        # Python dependencies
├── models/                 # Saved models
│   ├── health_model.pkl   # Trained model
│   ├── scaler.pkl         # Feature scaler
│   └── model_info.json    # Model metadata
└── uploads/               # Uploaded CSV files

backend_fitness/
└── controllers/
    └── aiController.js    # Calls ML service
```

---

**🎊 Congratulations! Your FitTrack AI now uses real Machine Learning!**
