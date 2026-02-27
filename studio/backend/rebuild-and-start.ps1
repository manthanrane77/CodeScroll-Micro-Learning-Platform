# Stop any running Java processes
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Set JAVA_HOME
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-23'
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "Building backend..." -ForegroundColor Green
mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Starting backend..." -ForegroundColor Green
    Start-Process java -ArgumentList "-jar","target\backend-0.0.1-SNAPSHOT.jar" -NoNewWindow
    Start-Sleep -Seconds 5
    Write-Host "Backend started on http://localhost:8081" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}
