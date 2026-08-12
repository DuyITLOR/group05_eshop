param(
    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory,

    [Parameter(Mandatory = $true)]
    [int]$BackendProcessId,

    [Parameter(Mandatory = $true)]
    [string]$StopFile
)

$ErrorActionPreference = 'Stop'
$resourceCsv = Join-Path $OutputDirectory 'resource-monitor.csv'
$hardwareJson = Join-Path $OutputDirectory 'hardware-context.json'

$computer = Get-CimInstance Win32_ComputerSystem
$operatingSystem = Get-CimInstance Win32_OperatingSystem
$processors = @(Get-CimInstance Win32_Processor)
$hardware = [pscustomobject]@{
    captured_at = (Get-Date).ToString('o')
    computer_manufacturer = $computer.Manufacturer
    computer_model = $computer.Model
    logical_processors = $computer.NumberOfLogicalProcessors
    total_physical_memory_bytes = [int64]$computer.TotalPhysicalMemory
    operating_system = $operatingSystem.Caption
    operating_system_version = $operatingSystem.Version
    processor_names = @($processors | ForEach-Object { $_.Name })
}
$hardware | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $hardwareJson -Encoding utf8

$firstSample = $true
while (-not (Test-Path -LiteralPath $StopFile)) {
    $timestamp = (Get-Date).ToString('o')
    $systemCpu = Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'"
    $currentOs = Get-CimInstance Win32_OperatingSystem
    $backend = Get-Process -Id $BackendProcessId -ErrorAction SilentlyContinue

    $sample = [pscustomobject]@{
        timestamp = $timestamp
        system_cpu_percent = if ($null -ne $systemCpu) { [double]$systemCpu.PercentProcessorTime } else { $null }
        system_memory_used_bytes = [int64](($currentOs.TotalVisibleMemorySize - $currentOs.FreePhysicalMemory) * 1KB)
        system_memory_free_bytes = [int64]($currentOs.FreePhysicalMemory * 1KB)
        backend_pid = $BackendProcessId
        backend_alive = ($null -ne $backend)
        backend_cpu_seconds = if ($null -ne $backend) { [double]$backend.CPU } else { $null }
        backend_working_set_bytes = if ($null -ne $backend) { [int64]$backend.WorkingSet64 } else { $null }
        backend_private_memory_bytes = if ($null -ne $backend) { [int64]$backend.PrivateMemorySize64 } else { $null }
        backend_thread_count = if ($null -ne $backend) { [int]$backend.Threads.Count } else { $null }
    }

    if ($firstSample) {
        $sample | Export-Csv -LiteralPath $resourceCsv -NoTypeInformation -Encoding utf8
        $firstSample = $false
    } else {
        $sample | Export-Csv -LiteralPath $resourceCsv -NoTypeInformation -Encoding utf8 -Append
    }

    Start-Sleep -Seconds 1
}
