import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os
import json

class HealthModelTrainer:
    def __init__(self):
        self.models = {
            'Decision Tree': DecisionTreeRegressor(random_state=42, max_depth=10),
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10),
            'K-Nearest Neighbors': KNeighborsRegressor(n_neighbors=5)
        }
        self.best_model = None
        self.best_model_name = None
        self.scaler = StandardScaler()
        self.model_dir = 'models'
        
        # Create models directory if it doesn't exist
        if not os.path.exists(self.model_dir):
            os.makedirs(self.model_dir)

        
   
    
    def prepare_data(self, csv_path):
        """
        Load and prepare data from CSV file
        Expected columns: steps, sleep_hours, calories, and optionally health_score
        """
        print(f"📂 Loading data from: {csv_path}")
        
        # Read CSV file
        df = pd.read_csv(csv_path)
        
        print(f"✅ Data loaded: {len(df)} rows")
        print(f"📊 Columns: {list(df.columns)}")
        
        # Clean column names (remove spaces, lowercase)
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

        # Map column names for steps, calories, and sleep_hours variants
        column_map = {
            'totalsteps': 'steps',
            'total_steps': 'steps',
            'step_count': 'steps',
            'calories': 'calories',
            'calorie': 'calories',
            'total_calories': 'calories',
            'calories_burned': 'calories',
            'sleep': 'sleep_hours',
            'sleep_time': 'sleep_hours',
            'total_sleep': 'sleep_hours'
        }
        for old_name, new_name in column_map.items():
            if old_name in df.columns:
                df.rename(columns={old_name: new_name}, inplace=True)

        # Add synthetic sleep_hours if missing
        if 'sleep_hours' not in df.columns:
            print("⚠️ 'sleep_hours' not found. Creating synthetic sleep_hours...")
            df['sleep_hours'] = np.random.randint(6, 9, size=len(df))  # 6-8 hours

        # Define feature columns
        feature_cols = ['steps', 'sleep_hours', 'calories']

        # Check if required columns exist
        missing_cols = [col for col in feature_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"❌ Missing required columns: {missing_cols}. Available: {list(df.columns)}")

        # Select features
        X = df[feature_cols].copy()

        # Create target variable (health_score) if it doesn't exist
        if 'health_score' not in df.columns:
            print("⚠️ 'health_score' column not found. Creating synthetic health scores...")
            y = self.calculate_health_score(X)
        else:
            y = df['health_score'].copy()

        # Handle missing values
        X = X.fillna(X.median())
        y = y.fillna(y.median())

        # Remove outliers (optional)
        X, y = self.remove_outliers(X, y)

        print(f"✅ Data prepared: {len(X)} samples")
        print(f"📊 Features: {feature_cols}")
        print(f"📈 Target range: {y.min():.2f} - {y.max():.2f}")

        return X, y, feature_cols
    
    def calculate_health_score(self, X):
        """
        Calculate synthetic health score based on steps, sleep, and calories
        Score range: 0-100
        """
        scores = []
        for _, row in X.iterrows():
            score = 0
            steps = row['steps']
            sleep_hours = row['sleep_hours']
            calories = row['calories']
            
            # Steps scoring (0-40 points)
            if steps >= 10000:
                score += 40
            elif steps >= 7000:
                score += 30
            elif steps >= 5000:
                score += 20
            else:
                score += 10
            
            # Sleep scoring (0-30 points)
            if 7 <= sleep_hours <= 9:
                score += 30
            elif 6 <= sleep_hours <= 10:
                score += 20
            else:
                score += 10
            
            # Calories scoring (0-30 points)
            if 1800 <= calories <= 2200:
                score += 30
            elif 1500 <= calories <= 2500:
                score += 20
            else:
                score += 10
            
            scores.append(score)
        
        return pd.Series(scores)
    
    def remove_outliers(self, X, y, threshold=3):
        """Remove outliers using Z-score method"""
        from scipy import stats
        z_scores = np.abs(stats.zscore(X))
        mask = (z_scores < threshold).all(axis=1)
        return X[mask], y[mask]
    
    def train_models(self, X, y):
        """
        Train multiple models and find the best one
        """
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        results = {}
        
        print("\n🔬 Training models...\n")
        
        for name, model in self.models.items():
            print(f"Training {name}...")
            
            # Train model
            model.fit(X_train_scaled, y_train)
            
            # Predictions
            y_pred = model.predict(X_test_scaled)
            
            # Metrics
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Cross-validation score
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, 
                                       scoring='r2')
            cv_mean = cv_scores.mean()
            
            results[name] = {
                'model': model,
                'rmse': rmse,
                'mae': mae,
                'r2': r2,
                'cv_score': cv_mean
            }
            
            print(f"  ✓ RMSE: {rmse:.4f}")
            print(f"  ✓ MAE: {mae:.4f}")
            print(f"  ✓ R²: {r2:.4f}")
            print(f"  ✓ CV Score: {cv_mean:.4f}\n")
        
        # Find best model based on R² score
        self.best_model_name = max(results.keys(), key=lambda k: results[k]['r2'])
        self.best_model = results[self.best_model_name]['model']
        
        print(f"🏆 Best Model: {self.best_model_name}")
        print(f"   R² Score: {results[self.best_model_name]['r2']:.4f}")
        
        return results
    
    def save_model(self):
        """Save the best model and scaler"""
        if self.best_model is None:
            raise ValueError("No model trained yet!")
        
        model_path = os.path.join(self.model_dir, 'health_model.pkl')
        scaler_path = os.path.join(self.model_dir, 'scaler.pkl')
        info_path = os.path.join(self.model_dir, 'model_info.json')
        
        # Save model and scaler
        joblib.dump(self.best_model, model_path)
        joblib.dump(self.scaler, scaler_path)
        
        # Save model info
        info = {
            'model_name': self.best_model_name,
            'features': ['steps', 'sleep_hours', 'calories']
        }
        with open(info_path, 'w') as f:
            json.dump(info, f, indent=2)
        
        print(f"\n✅ Model saved:")
        print(f"   📁 {model_path}")
        print(f"   📁 {scaler_path}")
        print(f"   📁 {info_path}")
    
    def train_from_csv(self, csv_path):
        """Complete training pipeline"""
        try:
            # Prepare data
            X, y, features = self.prepare_data(csv_path)
            
            # Train models
            results = self.train_models(X, y)
            
            # Save best model
            self.save_model()
            
            return {
                'success': True,
                'best_model': self.best_model_name,
                'results': {
                    name: {
                        'rmse': float(info['rmse']),
                        'mae': float(info['mae']),
                        'r2': float(info['r2']),
                        'cv_score': float(info['cv_score'])
                    }
                    for name, info in results.items()
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


if __name__ == '__main__':
    # Example usage
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python train_model.py <path_to_csv>")
        print("Example: python train_model.py C:\\Users\\Admin\\Downloads\\sample_fitbit\\data.csv")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    print("=" * 60)
    print("🏋️ FitTrack AI - ML Model Training")
    print("=" * 60)
    
    trainer = HealthModelTrainer()
    result = trainer.train_from_csv(csv_path)
    
    if result['success']:
        print("\n" + "=" * 60)
        print("✅ Training completed successfully!")
        print("=" * 60)
    else:
        print(f"\n❌ Training failed: {result['error']}")
