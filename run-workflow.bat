@echo off
setlocal ENABLEDELAYEDEXPANSION

echo ==========================================
echo   WorkflowVisual bootstrap and dev server
echo ==========================================

echo.
if not exist ".env" (
  echo [WARN] No .env file found in the project root. DATABASE_URL is required for persistence.
)

echo Checking node_modules cache...
if not exist node_modules (
  echo Installing npm dependencies...
  call npm install
  if errorlevel 1 goto :error
) else (
  echo Dependencies already installed.
)

echo.
echo Applying Prisma migrations...
call npx prisma migrate deploy
if errorlevel 1 goto :error

echo.
echo Generating Prisma client...
call npx prisma generate
if errorlevel 1 goto :error

echo.
echo Starting Next.js development server...
call npm run dev
exit /b 0

:error
echo.
echo [ERROR] Setup failed. Review the output above for details.
exit /b 1
