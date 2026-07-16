@echo off
echo Memulai instalasi Flask dan Flask-CORS...

:: 1. Membuat dan mengaktifkan Virtual Environment
python -m venv venv
call venv\Scripts\activate

:: 2. Upgrade pip ke versi terbaru
py -m pip install --upgrade pip

:: 3. Instal Flask dan Flask-CORS saja
echo Menginstall Flask...
py -m pip install Flask

echo Menginstall Flask-CORS...
py -m pip install Flask-CORS

echo.
echo ==============================================
echo Instalasi berhasil! Tekan tombol apa saja untuk keluar.
echo ==============================================
pause > nul
