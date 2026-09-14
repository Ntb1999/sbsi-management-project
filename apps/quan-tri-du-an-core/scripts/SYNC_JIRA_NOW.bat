@echo off
chcp 65001 >nul
title Đồng Bộ Jira FSS - SBSI UAT Command Portal
cls
echo ===============================================================================
echo   🏛️  ĐỒNG BỘ DỮ LIỆU ISSUE TỪ JIRA FSS (PROJECT: SBSIUAT)
echo ===============================================================================
echo.
if not exist "%~dp0.env" (
  echo   LOI: Khong tim thay scripts\.env
  echo   Hay copy scripts\.env.example thanh scripts\.env va dien JIRA_USER / JIRA_PASS.
  echo.
  pause
  exit /b 1
)
echo   Dang ket noi Jira FSS (https://projects.fss.com.vn)...
echo   (Chi hoat dong khi may dang o trong mang noi bo cong ty / VPN)
echo.
python "%~dp0sync_jira_fss.py"
if errorlevel 1 (
  echo.
  echo ===============================================================================
  echo   ❌ ĐỒNG BỘ THẤT BẠI - xem lỗi phía trên.
  echo ===============================================================================
  echo.
  pause
  exit /b 1
)
echo.
echo ===============================================================================
echo   ✅ HOÀN TẤT ĐỒNG BỘ! Hãy mở hoặc tải lại (F5) trang UAT Command Portal.
echo ===============================================================================
echo.
pause
