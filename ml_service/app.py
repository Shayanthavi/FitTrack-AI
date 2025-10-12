from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
import json
from werkzeug.utils import secure_filename
from train_model import HealthModelTrainer

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
MODEL_FOLDER = 'models'
ALLOWED_EXTENSIONS = {'csv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

# Global model and scaler
model = None
scaler = None
model_info = None


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_model():
    """Load the trained model and scaler"""
    global model, scaler, model_info
    
    model_path = os.path.join(MODEL_FOLDER, 'health_model.pkl')
    scaler_path = os.path.join(MODEL_FOLDER, 'scaler.pkl')
    info_path = os.path.join(MODEL_FOLDER, 'model_info.json')
    
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        if os.path.exists(info_path):
            with open(info_path, 'r') as f:
                model_info = json.load(f)
        
        print("✅ Model loaded successfully")
        return True
    else:
        print("⚠️ No trained model found. Please train a model first.")
        return False


def generate_suggestions(steps, sleep_hours, calories, health_score):
    """Generate health suggestions based on metrics and ML prediction"""
    suggestions = []
    
    # Steps analysis
    if steps < 5000:
        suggestions.append({
            'category': 'Activity',
            'level': 'urgent',
            'message': f'🚶‍♂️ Your step count ({steps:,}) is quite low. Try to reach at least 7,000 steps daily!',
            'tip': 'Take short walks every hour, use stairs, or walk during phone calls.'
        })
    elif steps < 7000:
        suggestions.append({
            'category': 'Activity',
            'level': 'warning',
            'message': f'👟 Good progress with {steps:,} steps! Aim for 10,000 for optimal health.',
            'tip': 'Add a 20-minute evening walk to reach your goal.'
        })
    else:
        suggestions.append({
            'category': 'Activity',
            'level': 'success',
            'message': f'🎉 Excellent! You achieved {steps:,} steps. Keep it up!',
            'tip': 'Maintain this consistency for long-term health benefits.'
        })
    
    # Sleep analysis
    if sleep_hours < 6:
        suggestions.append({
            'category': 'Sleep',
            'level': 'urgent',
            'message': f'😴 Only {sleep_hours} hours of sleep! Aim for 7-8 hours for better recovery.',
            'tip': 'Create a bedtime routine and avoid screens 1 hour before sleep.'
        })
    elif sleep_hours < 7:
        suggestions.append({
            'category': 'Sleep',
            'level': 'warning',
            'message': f'🌙 {sleep_hours} hours is okay, but try for 7-8 hours.',
            'tip': 'Go to bed 30 minutes earlier tonight.'
        })
    elif sleep_hours <= 9:
        suggestions.append({
            'category': 'Sleep',
            'level': 'success',
            'message': f'✨ Great sleep duration of {sleep_hours} hours!',
            'tip': 'Keep this consistent sleep schedule.'
        })
    else:
        suggestions.append({
            'category': 'Sleep',
            'level': 'info',
            'message': f'💤 {sleep_hours} hours is quite long. Focus on sleep quality.',
            'tip': 'Consider factors like room temperature and mattress comfort.'
        })
    
    # Calories analysis
    if calories < 1500:
        suggestions.append({
            'category': 'Nutrition',
            'level': 'warning',
            'message': f'🍎 {calories} calories seems low. Ensure adequate nutrition.',
            'tip': 'Add nutrient-dense snacks like nuts, fruits, or smoothies.'
        })
    elif calories > 2500:
        suggestions.append({
            'category': 'Nutrition',
            'level': 'warning',
            'message': f'🥗 {calories} calories is high. Consider portion control.',
            'tip': 'Focus on vegetables, lean proteins, and whole grains.'
        })
    else:
        suggestions.append({
            'category': 'Nutrition',
            'level': 'success',
            'message': f'🍽️ Balanced intake of {calories} calories!',
            'tip': 'Stay hydrated and include colorful foods.'
        })
    
    # Overall health score
    score = int(health_score)
    if score >= 80:
        level = 'success'
        message = f'🏆 Outstanding! Your AI health score is {score}/100.'
        tip = 'You\'re a health champion! Keep inspiring others.'
    elif score >= 60:
        level = 'success'
        message = f'💪 Good job! Your AI health score is {score}/100.'
        tip = 'Small improvements can push you to excellence.'
    elif score >= 40:
        level = 'warning'
        message = f'⚡ Your AI health score is {score}/100. Room for improvement!'
        tip = 'Focus on one area at a time—start with what feels easiest.'
    else:
        level = 'urgent'
        message = f'🎯 Your AI health score is {score}/100. Let\'s improve!'
        tip = 'Start small: set achievable daily goals and build from there.'
    
    suggestions.append({
        'category': 'Overall',
        'level': level,
        'message': message,
        'tip': tip,
        'score': score
    })
    
    return suggestions


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'FitTrack AI - ML Service',
        'version': '1.0.0',
        'status': 'running',
        'model_loaded': model is not None,
        'model_info': model_info if model_info else 'No model trained yet'
    })


@app.route('/train', methods=['POST'])
def train():
    """Train ML model with uploaded CSV file"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Only CSV files are allowed'}), 400
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        print(f"📁 File saved: {filepath}")
        
        # Train model
        trainer = HealthModelTrainer()
        result = trainer.train_from_csv(filepath)
        
        if result['success']:
            # Reload the model
            load_model()
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/predict', methods=['POST'])
def predict():
    """Get health prediction and suggestions"""
    if model is None or scaler is None:
        return jsonify({
            'success': False,
            'error': 'Model not trained yet. Please train the model first.'
        }), 400
    
    try:
        data = request.json
        print("Received data:", data)
        
        # Validate input
        required_fields = ['steps', 'sleep_hours', 'calories']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {required_fields}'
            }), 400
        
        # Prepare features
        features = np.array([[
            float(data['steps']),
            float(data['sleep_hours']),
            float(data['calories'])
        ]])
        
        # Scale and predict
        features_scaled = scaler.transform(features)
        health_score = model.predict(features_scaled)[0]
        
        # Ensure score is between 0-100
        health_score = max(0, min(100, health_score))
        
        # Generate suggestions
        suggestions = generate_suggestions(
            int(data['steps']),
            float(data['sleep_hours']),
            int(data['calories']),
            health_score
        )
        
        return jsonify({
            'success': True,
            'suggestions': suggestions,
            'based_on': {
                'steps': int(data['steps']),
                'sleep_hours': float(data['sleep_hours']),
                'calories': int(data['calories']),
                'date': data.get('date', 'today')
            },
            'model_used': model_info['model_name'] if model_info else 'Unknown'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/model/info', methods=['GET'])
def model_info_endpoint():
    """Get information about the current model"""
    if model is None:
        return jsonify({
            'success': False,
            'error': 'No model loaded'
        }), 400
    
    return jsonify({
        'success': True,
        'model_info': model_info,
        'model_loaded': True
    })


if __name__ == '__main__':
    # Try to load existing model
    load_model()
    
    # Run Flask app
    print("\n" + "=" * 60)
    print("🚀 FitTrack AI - ML Service Starting")
    print("=" * 60)
    print("📍 Running on: http://localhost:5000")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
