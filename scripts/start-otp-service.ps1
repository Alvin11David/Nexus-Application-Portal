$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $env:USERPROFILE '.otp-service.env'
$repoEnvFile = Join-Path $repoRoot '.otp-service.env'
$pythonExe = 'C:\Users\ALVIN\AppData\Local\Programs\Python\Python313\python.exe'

if (-not (Test-Path $envFile) -and (Test-Path $repoEnvFile)) {
    $envFile = $repoEnvFile
}

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith('#')) {
            return
        }

        $parts = $line -split '=', 2
        if ($parts.Count -ne 2) {
            return
        }

        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        if ($name) {
            [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
}

Set-Location $repoRoot
& $pythonExe "$repoRoot\otp_service.py"
