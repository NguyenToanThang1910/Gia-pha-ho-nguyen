# Script khôi phục dữ liệu 26 thành viên lên Firebase Realtime Database
$backupPath = Join-Path $PSScriptRoot "members_backup.json"
$firebaseUrl = "https://giapha-honguyen-default-rtdb.asia-southeast1.firebasedatabase.app/members.json"

if (-not (Test-Path $backupPath)) {
    Write-Host "Khong tim thay file members_backup.json tai: $backupPath" -ForegroundColor Red
    pause
    exit
}

Write-Host "Dang doc du lieu sao luu tu members_backup.json..." -ForegroundColor Cyan
$jsonBody = [System.IO.File]::ReadAllText($backupPath, [System.Text.Encoding]::UTF8)

try {
    Write-Host "Dang day du lieu len Firebase..." -ForegroundColor Yellow
    $res = Invoke-RestMethod -Uri $firebaseUrl -Method Put -Body $jsonBody -ContentType "application/json; charset=utf-8"
    Write-Host "THANH CONG! Da nap lai thanh cong toan bo thanh vien len Firebase!" -ForegroundColor Green
} catch {
    Write-Host "Loi khi nap du lieu: $($_.Exception.Message)" -ForegroundColor Red
}

pause
