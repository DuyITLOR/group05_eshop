[CmdletBinding(DefaultParameterSetName = 'Execute')]
param(
    [Parameter(Mandatory = $true)]
    [string]$JMeterPath,

    [Parameter(Mandatory = $true, ParameterSetName = 'Version')]
    [switch]$VersionOnly,

    [Parameter(Mandatory = $true, ParameterSetName = 'Execute')]
    [string]$JmxPath,

    [Parameter(Mandatory = $true, ParameterSetName = 'Execute')]
    [string]$SecretPropertiesPath,

    [Parameter(Mandatory = $true, ParameterSetName = 'Execute')]
    [string]$BaseUrl,

    [Parameter(Mandatory = $true, ParameterSetName = 'Execute')]
    [string]$RawJtlPath,

    [Parameter(Mandatory = $true, ParameterSetName = 'Execute')]
    [string]$HtmlDirectory,

    [Parameter(Mandatory = $true, ParameterSetName = 'Execute')]
    [string]$JMeterLogPath
)

$ErrorActionPreference = 'Stop'

if ($VersionOnly) {
    & $JMeterPath -v
    exit $LASTEXITCODE
}

& $JMeterPath `
    -n `
    -t $JmxPath `
    -q $SecretPropertiesPath `
    "-JbaseUrl=$BaseUrl" `
    -l $RawJtlPath `
    -e `
    -o $HtmlDirectory `
    -j $JMeterLogPath

exit $LASTEXITCODE
