<#
run-backend.ps1
Helper to build and run the backend locally without Docker.
Usage examples:
  # Build + run (H2 file DB by default)
  .\run-backend.ps1

  # Build + run using the mysql profile (assumes you have a MySQL server available and configured)
  .\run-backend.ps1 -Profile mysql

  # Build only
  .\run-backend.ps1 -BuildOnly

  # Skip build and just run
  .\run-backend.ps1 -SkipBuild
#>
param(
    [string]$Profile = "",
    [switch]$BuildOnly,
    [switch]$SkipBuild
)

function Find-JdkRoot {
    if ($env:JAVA_HOME -and (Test-Path "$env:JAVA_HOME\bin\java.exe")) {
        return $env:JAVA_HOME
    }

    # common install locations
    $candidates = @(
        'C:\Program Files\Eclipse Adoptium',
        'C:\Program Files\Java',
        'C:\Program Files\Amazon Corretto',
        'C:\Program Files\Temurin'
    )

    foreach ($base in $candidates) {
        if (Test-Path $base) {
            $dirs = Get-ChildItem -Path $base -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'jdk|temurin|corretto|jdk-?\d+' } | Sort-Object Name -Descending
            if ($dirs -and $dirs.Count -gt 0) {
                foreach ($d in $dirs) {
                    $maybe = Join-Path $d.FullName ''
                    if (Test-Path "$maybe\bin\java.exe") { return $maybe }
                }
            }
        }
    }
    return $null
}

Write-Host "Finding JDK..."
$jdk = Find-JdkRoot
if (-not $jdk) {
    Write-Error "No JDK found. Please install JDK 21 and/or set JAVA_HOME."
    exit 1
}

if (-not $env:JAVA_HOME) {
    Write-Host "Setting JAVA_HOME to: $jdk (session only)"
    $env:JAVA_HOME = $jdk
} else {
    Write-Host "JAVA_HOME already set: $env:JAVA_HOME"
}

$env:Path = "$env:JAVA_HOME\bin;$env:Path"

Write-Host "java -version:"; & "$env:JAVA_HOME\bin\java.exe" -version

# ensure mvn is on PATH
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvnCmd) {
    Write-Error "Maven (mvn) not found on PATH. Please install Maven or add it to PATH."
    exit 1
}

if ($BuildOnly) {
    Write-Host "Building project (skip tests)..."
    mvn -DskipTests package
    exit $LASTEXITCODE
}

if (-not $SkipBuild) {
    Write-Host "Building project (skip tests)..."
    mvn -DskipTests package
    if ($LASTEXITCODE -ne 0) { Write-Error "Build failed."; exit $LASTEXITCODE }
}

# copy snapshot jar to ../snapshots with timestamp
$targetJar = Join-Path -Path "target" -ChildPath "backend-0.0.1-SNAPSHOT.jar"
if (Test-Path $targetJar) {
    $snapDir = Join-Path -Path ".." -ChildPath "snapshots"
    if (-not (Test-Path $snapDir)) { New-Item -ItemType Directory -Path $snapDir | Out-Null }
    $t = (Get-Date).ToString('yyyyMMdd-HHmmss')
    $dest = Join-Path -Path $snapDir -ChildPath "backend-$t.jar"
    Copy-Item -Path $targetJar -Destination $dest -Force
    Write-Host "Saved snapshot to: $dest"
} else {
    Write-Warning "Expected jar not found at $targetJar (build may have failed or produced a different artifact name)."
}

if ($SkipBuild) { Write-Host "Skipping run as requested."; exit 0 }

# Run with mvn spring-boot:run (uses spring-boot plugin) or use profile
if ($Profile -ne "") {
    Write-Host "Starting backend with profile: $Profile"
    mvn -Dspring-boot.run.profiles=$Profile spring-boot:run
} else {
    Write-Host "Starting backend (default profile, H2 file DB)..."
    mvn spring-boot:run
}
