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

if (-not (Test-Path -LiteralPath $OutputDirectory -PathType Container)) {
    throw "Output directory does not exist: $OutputDirectory"
}

$initialBackend = Get-Process -Id $BackendProcessId -ErrorAction SilentlyContinue
if ($null -eq $initialBackend) {
    throw "Backend process ID $BackendProcessId does not exist at monitor startup."
}

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public static class Hw05WindowsMetrics
{
    [StructLayout(LayoutKind.Sequential)]
    public struct FileTime
    {
        public uint Low;
        public uint High;
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    public class MemoryStatusEx
    {
        public uint Length = (uint)Marshal.SizeOf(typeof(MemoryStatusEx));
        public uint MemoryLoad;
        public ulong TotalPhysical;
        public ulong AvailablePhysical;
        public ulong TotalPageFile;
        public ulong AvailablePageFile;
        public ulong TotalVirtual;
        public ulong AvailableVirtual;
        public ulong AvailableExtendedVirtual;
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern bool GetSystemTimes(
        out FileTime idleTime,
        out FileTime kernelTime,
        out FileTime userTime);

    [return: MarshalAs(UnmanagedType.Bool)]
    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern bool GlobalMemoryStatusEx([In, Out] MemoryStatusEx status);
}
'@

function Convert-FileTimeToUInt64 {
    param([Hw05WindowsMetrics+FileTime]$Value)

    return ([uint64]$Value.High * 4294967296) + [uint64]$Value.Low
}

function Get-SystemTimesSnapshot {
    $idle = New-Object Hw05WindowsMetrics+FileTime
    $kernel = New-Object Hw05WindowsMetrics+FileTime
    $user = New-Object Hw05WindowsMetrics+FileTime
    if (-not [Hw05WindowsMetrics]::GetSystemTimes([ref]$idle, [ref]$kernel, [ref]$user)) {
        throw "GetSystemTimes failed with Win32 error $([Runtime.InteropServices.Marshal]::GetLastWin32Error())."
    }

    return [pscustomobject]@{
        idle = Convert-FileTimeToUInt64 $idle
        kernel = Convert-FileTimeToUInt64 $kernel
        user = Convert-FileTimeToUInt64 $user
    }
}

function Get-MemorySnapshot {
    $status = New-Object Hw05WindowsMetrics+MemoryStatusEx
    if (-not [Hw05WindowsMetrics]::GlobalMemoryStatusEx($status)) {
        throw "GlobalMemoryStatusEx failed with Win32 error $([Runtime.InteropServices.Marshal]::GetLastWin32Error())."
    }

    return $status
}

$initialMemory = Get-MemorySnapshot
$processorName = (Get-ItemProperty `
    -LiteralPath 'HKLM:\HARDWARE\DESCRIPTION\System\CentralProcessor\0' `
    -Name ProcessorNameString `
    -ErrorAction SilentlyContinue).ProcessorNameString
$hardware = [pscustomobject]@{
    captured_at = (Get-Date).ToString('o')
    capture_source = 'WINDOWS_NATIVE_API_NO_CIM'
    computer_name = [Environment]::MachineName
    computer_manufacturer = $null
    computer_model = $null
    logical_processors = [Environment]::ProcessorCount
    total_physical_memory_bytes = [uint64]$initialMemory.TotalPhysical
    operating_system = [Runtime.InteropServices.RuntimeInformation]::OSDescription
    operating_system_version = [Environment]::OSVersion.Version.ToString()
    operating_system_architecture = [Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
    process_architecture = [Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture.ToString()
    processor_names = @($processorName | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    unavailable_fields = @('computer_manufacturer', 'computer_model')
    unavailable_reason = 'CIM intentionally not used because run-001 recorded HRESULT 0x80041003.'
}
$hardware | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $hardwareJson -Encoding utf8

$firstSample = $true
$previousTimes = Get-SystemTimesSnapshot
while (-not (Test-Path -LiteralPath $StopFile)) {
    Start-Sleep -Seconds 1
    if (Test-Path -LiteralPath $StopFile) {
        break
    }

    $timestamp = (Get-Date).ToString('o')
    $currentTimes = Get-SystemTimesSnapshot
    $idleDelta = $currentTimes.idle - $previousTimes.idle
    $kernelDelta = $currentTimes.kernel - $previousTimes.kernel
    $userDelta = $currentTimes.user - $previousTimes.user
    $totalDelta = $kernelDelta + $userDelta
    $systemCpuPercent = if ($totalDelta -gt 0) {
        [Math]::Round((($totalDelta - $idleDelta) / $totalDelta) * 100, 2)
    } else {
        $null
    }
    $memory = Get-MemorySnapshot
    $backend = Get-Process -Id $BackendProcessId -ErrorAction SilentlyContinue

    $sample = [pscustomobject]@{
        timestamp = $timestamp
        system_cpu_percent = $systemCpuPercent
        system_memory_used_bytes = [uint64]($memory.TotalPhysical - $memory.AvailablePhysical)
        system_memory_free_bytes = [uint64]$memory.AvailablePhysical
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

    $previousTimes = $currentTimes
}
