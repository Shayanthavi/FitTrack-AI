# FitTrack AI - ML Service 🤖

Machine Learning service for FitTrack AI using Flask and scikit-learn.

## 📊 Models Trained

The service trains and compares 3 ML models:
1. **Decision Tree Regressor**
2. **Random Forest Regressor** (usually best)
3. **K-Nearest Neighbors Regressor**

The best performing model is automatically selected and saved.

---

## 🚀 Setup Instructions

### Step 1: Install Python Dependencies

```powershell
cd d:\Intern\StudentMan\Fitness\ml_service
pip install -r requirements.txt
```

### Step 2: Prepare Your Dataset

Your CSV should have columns:
- `steps` or `total_steps` or `TotalSteps`
- `sleep_hours` or `sleep` or `SleepHours`
- `calories` or `Calories` or `CaloriesBurned`
- `health_score` (optional - will be calculated if missing)

**Example CSV format:**
```csv
steps,sleep_hours,calories
8000,7.5,2000
5000,6.0,1800
12000,8.0,2200
```

### Step 3: Train the Model

**Option A: Upload via API (Recommended)**

1. Start the Flask service:
```powershell
python app.py
```

2. Upload CSV via Postman or frontend:
```
POST http://localhost:5001/train
Body: form-data
  file: your_dataset.csv
```

**Option B: Train directly from command line**

```powershell
python train_model.py "C:\Users\Admin\Downloads\sample fitbit\your_file.csv"
```

---

## 🔧 Running the ML Service

```powershell
cd d:\Intern\StudentMan\Fitness\ml_service
python app.py
```

The service will run on **http://localhost:5001**

---

## 📡 API Endpoints

### 1. Home / Status
```http
GET http://localhost:5001/
```

Response:
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

### 2. Train Model
```http
POST http://localhost:5001/train
Content-Type: multipart/form-data

file: your_dataset.csv
```

Response:
```json
{
  "success": true,
  "best_model": "Random Forest",
  "results": {
    "Decision Tree": {
      "rmse": 5.23,
      "mae": 3.45,
      "r2": 0.89,
      "cv_score": 0.87
    },
    "Random Forest": {
      "rmse": 4.12,
      "mae": 2.98,
      "r2": 0.93,
      "cv_score": 0.91
    },
    ...
  }
}
```

### 3. Get Prediction
```http
POST http://localhost:5001/predict
Content-Type: application/json

{
  "steps": 8000,
  "sleep_hours": 7.5,
  "calories": 2000,
  "date": "2024-10-11"
}
```

Response:
```json
{
  "success": true,
  "suggestions": [
    {
      "category": "Activity",
      "level": "success",
      "message": "🎉 Excellent! You achieved 8,000 steps...",
      "tip": "Maintain this consistency..."
    },
    ...
  ],
  "based_on": {
    "steps": 8000,
    "sleep_hours": 7.5,
    "calories": 2000
  },
  "model_used": "Random Forest"
}
```

### 4. Get Model Info
```http
GET http://localhost:5001/model/info
```

---

## 📁 Generated Files

After training, these files are created:

```
ml_service/
├── models/
│   ├── health_model.pkl      # Trained model
│   ├── scaler.pkl            # Feature scaler
│   └── model_info.json       # Model metadata
├── uploads/                  # Uploaded CSV files
└── ...
```

---

## 🧪 Testing the ML Service

### Test 1: Check if service is running
```powershell
curl http://localhost:5001/
```

### Test 2: Train with your dataset
```powershell
# Using Python
python train_model.py "C:\Users\Admin\Downloads\sample fitbit\data.csv"

# Or use the API with Postman/frontend
```

### Test 3: Get prediction
```powershell
curl -X POST http://localhost:5001/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"steps\":8000,\"sleep_hours\":7.5,\"calories\":2000}"
```

---

## 🔄 Integration with Backend

The Node.js backend automatically calls the ML service:

1. **ML Service Running** → Uses ML predictions
2. **ML Service Down** → Falls back to rule-based logic

No changes needed in frontend! The backend handles everything.

---

## 📊 Model Performance Metrics

- **RMSE** (Root Mean Squared Error): Lower is better
- **MAE** (Mean Absolute Error): Lower is better
- **R² Score**: Higher is better (max 1.0 = perfect)
- **CV Score**: Cross-validation score (consistency)

**Good Model:** R² > 0.85, CV Score > 0.80

---

## 🐛 Troubleshooting

### Error: Module not found
```powershell
pip install -r requirements.txt
```

### Error: No module named 'sklearn'
```powershell
pip install scikit-learn
```

### Error: File not found during training
- Check the file path is correct
- Use full path: `C:\Users\Admin\Downloads\...`
- Make sure CSV file exists

### Error: Missing columns in CSV
- Check your CSV has: steps, sleep_hours, calories
- Alternative column names are supported (see README)

---

## 📈 Improving Model Performance

1. **More Data**: Collect more health logs (100+ samples ideal)
2. **Data Quality**: Remove duplicates and outliers
3. **Feature Engineering**: Add more features (age, weight, etc.)
4. **Hyperparameter Tuning**: Adjust model parameters

---

## ✅ Success Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Dataset prepared (CSV with steps, sleep, calories)
- [ ] Model trained successfully
- [ ] Flask service running on port 5001
- [ ] Can get predictions via API
- [ ] Backend integrated with ML service

---

**🎉 Your ML service is ready to provide intelligent health insights!**
