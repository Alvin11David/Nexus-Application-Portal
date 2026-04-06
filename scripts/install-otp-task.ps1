$ErrorActionPreference = 'Stop'

$taskName = 'OtpService'
$cmdPath = 'C:\Users\ALVIN\institute-website\scripts\start-otp-service.cmd'

$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$cmdPath`""
$trigger = New-ScheduledTaskTrigger -AtLogOn

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -RunLevel Highest -Force | Out-Null
Get-ScheduledTask -TaskName $taskName | Select-Object TaskName, State, TaskPath
