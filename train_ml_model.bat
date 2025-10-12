@echo off
echo ========================================
echo FitTrack AI - Train ML Model
echo ========================================
echo.
set /p CSV_PATH="Enter CSV file path: "
echo.
cd ml_service
python train_model.py "%CSV_PATH%"
echo.
pause
