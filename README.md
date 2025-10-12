# FitTrack AI - Full-Stack Health & Fitness Tracker 🏃‍♂️💪

A modern, full-stack web application that helps users track their daily fitness and health metrics (steps, sleep, calories) and receive personalized AI-powered health suggestions.

## 🌟 Features

### Frontend
- ✅ **Modern Landing Page** with Lottie animations and gradient design
- ✅ **User Authentication** (Login/Register) with JWT tokens
- ✅ **Interactive Dashboard** with animated metric cards
- ✅ **Real-time Charts** showing health trends (Recharts)
- ✅ **AI Health Suggestions** with personalized recommendations
- ✅ **Responsive Design** using Tailwind CSS
- ✅ **Smooth Animations** with Framer Motion

### Backend
- ✅ **RESTful API** built with Node.js + Express
- ✅ **MySQL Database** for data persistence
- ✅ **JWT Authentication** with bcrypt password hashing
- ✅ **Rule-based AI Engine** for health suggestions
- ✅ **Protected Routes** with authentication middleware
- ✅ **Health Scoring System** (0-100 based on metrics)

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js | UI Development |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Animations** | Framer Motion + Lottie | Smooth transitions & engaging UI |
| **Charts** | Recharts | Data visualization |
| **Backend** | Node.js + Express | REST API |
| **Database** | MySQL | Data storage |
| **Auth** | JWT + bcrypt | Secure authentication |
| **AI** | Rule-based logic | Personalized suggestions |

## 📁 Project Structure

```
Fitness/
├── backend/                 # Node.js Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth middleware
│   ├── routes/            # API routes
│   ├── database/          # SQL schema
│   ├── server.js          # Entry point
│   └── package.json
│
└── frontend_fitness/       # React Frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── utils/         # Utility functions
    │   ├── config/        # API configuration
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── package.json
```

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

### Step 1: Clone & Navigate
```bash
cd d:\Intern\StudentMan\Fitness
```

### Step 2: Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup MySQL Database:**

First, make sure MySQL is running. Then create the database and tables:

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Or manually copy-paste the SQL from database/schema.sql
```

4. **Configure Environment:**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fittrack_db

JWT_SECRET=your_super_secret_jwt_key_change_this
```

5. **Start Backend Server:**
```bash
# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

Backend should now be running on `http://localhost:5000` ✅

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend:**
```bash
cd d:\Intern\StudentMan\Fitness\frontend_fitness
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install missing dependency (if needed):**
```bash
npm install lottie-react
```

4. **Configure Environment:**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Content of `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start Frontend Development Server:**
```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173` ✅

## 🎯 Usage Guide

### 1. First Time Setup
1. Open browser and go to `http://localhost:5173`
2. Click **"Get Started"** or **"Sign Up"**
3. Create your account with name, email, and password
4. You'll be automatically logged in and redirected to the dashboard

### 2. Using the Dashboard
1. **Log Daily Metrics:**
   - Enter your steps (e.g., 8000)
   - Enter sleep hours (e.g., 7.5)
   - Enter calories consumed (e.g., 2000)
   - Click **"Save Today's Log"**

2. **View Your Progress:**
   - Metric cards show your latest data
   - Charts display trends over the last 14 days
   - Watch your health journey unfold!

3. **Get AI Suggestions:**
   - Click **"Get AI Suggestions"** button
   - AI analyzes your data and provides:
     - Overall health score (0-100)
     - Category-specific recommendations
     - Actionable tips for improvement

### 3. Logout
- Click the **"Logout"** button in the navbar
- You'll be redirected to the landing page

## 🔥 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Logs
- `POST /api/health/add-log` - Add/update daily log (protected)
- `GET /api/health/get-logs?limit=30` - Get health logs (protected)
- `GET /api/health/latest` - Get latest log (protected)
- `GET /api/health/stats?days=7` - Get statistics (protected)

### AI Suggestions
- `GET /api/ai/suggestion` - Get AI suggestions (protected)
- `GET /api/ai/history?limit=10` - Get suggestion history (protected)

## 🎨 Color Palette

The app uses a modern, vibrant color scheme:

- **Primary:** `#6366F1` (Indigo)
- **Secondary:** `#8B5CF6` (Purple)
- **Success:** `#10B981` (Emerald Green)
- **Warning:** `#F59E0B` (Amber)
- **Danger:** `#EF4444` (Red)
- **Info:** `#3B82F6` (Blue)

## 🧪 Testing the Application

### Test User Journey:
1. ✅ **Register** → Create account
2. ✅ **Login** → Sign in
3. ✅ **Dashboard** → See empty state
4. ✅ **Log Metrics** → Add today's data
5. ✅ **View Charts** → See data visualized
6. ✅ **AI Suggestions** → Get personalized tips
7. ✅ **Add More Data** → Log multiple days
8. ✅ **Track Trends** → Watch charts update

### Sample Test Data:
```json
Day 1: { steps: 5000, sleep: 6, calories: 1800 }
Day 2: { steps: 8000, sleep: 7, calories: 2000 }
Day 3: { steps: 10000, sleep: 8, calories: 2200 }
```

## 🐛 Troubleshooting

### Backend Issues:

**MySQL Connection Error:**
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database `fittrack_db` exists

**Port 5000 already in use:**
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env`

### Frontend Issues:

**Module not found errors:**
```bash
cd frontend_fitness
npm install
```

**API connection failed:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack development (React + Node.js + MySQL)
- ✅ RESTful API design
- ✅ JWT authentication & authorization
- ✅ Database design & relationships
- ✅ Modern UI/UX with animations
- ✅ Data visualization with charts
- ✅ AI integration (rule-based system)
- ✅ Responsive design
- ✅ State management in React

## 📝 Future Enhancements

- [ ] OpenAI integration for advanced suggestions
- [ ] Social features (share progress)
- [ ] Goal setting and achievements
- [ ] Weekly/monthly reports
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] Nutrition database integration
- [ ] Exercise library with videos

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ for the health and fitness community.

---

**🎉 Enjoy tracking your fitness journey with FitTrack AI!**
