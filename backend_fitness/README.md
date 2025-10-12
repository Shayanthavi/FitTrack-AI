# FitTrack AI Backend

Backend API for FitTrack AI - Health & Fitness Tracker with AI Suggestions

## Tech Stack
- **Node.js** + **Express.js** - REST API
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend_fitness
npm install
```

### 2. Database Setup
1. Make sure MySQL is installed and running
2. Create database and tables:
```bash
mysql -u root -p < database/schema.sql
```

### 3. Environment Configuration
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fittrack_db
JWT_SECRET=your_secret_key
```

### 4. Run Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Logs
- `POST /api/health/add-log` - Add/update daily log (protected)
- `GET /api/health/get-logs` - Get user's logs (protected)
- `GET /api/health/latest` - Get latest log (protected)
- `GET /api/health/stats` - Get statistics (protected)

### AI Suggestions
- `GET /api/ai/suggestion` - Get personalized suggestions (protected)
- `GET /api/ai/history` - Get suggestion history (protected)

## Features
✅ User authentication with JWT
✅ Password hashing with bcrypt
✅ Daily health metrics tracking
✅ Rule-based AI health suggestions
✅ Historical data analysis
✅ Health statistics calculation
