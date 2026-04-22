@echo off
cd /d "C:\Users\YasuyukiYamaguchi\Downloads\ai\sns"
"C:\Program Files\Git\bin\git.exe" rm --cached setup_git.bat 2>nul
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: add docs, proposals, and sample project"
echo Done.
