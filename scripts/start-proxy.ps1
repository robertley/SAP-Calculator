$scriptPath = Join-Path $PSScriptRoot "mitmproxy-plugin.py"

if (-not (Test-Path $scriptPath)) {
	Write-Error "mitmproxy plugin not found at $scriptPath"
	exit 1
}

$mitmCommand = Get-Command mitmproxy -ErrorAction SilentlyContinue
if ($mitmCommand) {
	& $mitmCommand.Source --allow-hosts teamwood.games -s $scriptPath
	exit $LASTEXITCODE
}

$candidatePaths = @(
	"$env:ProgramFiles\mitmproxy\bin\mitmproxy.exe",
	"$env:LOCALAPPDATA\Programs\mitmproxy\bin\mitmproxy.exe",
	"$env:USERPROFILE\anaconda3\Scripts\mitmproxy.exe",
	"$env:USERPROFILE\miniconda3\Scripts\mitmproxy.exe"
)

foreach ($candidate in $candidatePaths) {
	if (Test-Path $candidate) {
		& $candidate --allow-hosts teamwood.games -s $scriptPath
		exit $LASTEXITCODE
	}
}

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) {
	& $pythonCommand.Source -m mitmproxy --allow-hosts teamwood.games -s $scriptPath
	if ($LASTEXITCODE -eq 0) {
		exit 0
	}
}

$condaCandidates = @(
	"$env:USERPROFILE\anaconda3\Scripts\conda.exe",
	"$env:USERPROFILE\miniconda3\Scripts\conda.exe"
)

foreach ($condaExe in $condaCandidates) {
	if (Test-Path $condaExe) {
		& $condaExe run -n base python -m mitmproxy --allow-hosts teamwood.games -s $scriptPath
		if ($LASTEXITCODE -eq 0) {
			exit 0
		}
	}
}

Write-Error @"
mitmproxy was not found.

Install options:
1) Official installer: https://mitmproxy.org/
2) pip: python -m pip install mitmproxy

Then rerun: .\scripts\start-proxy.ps1
"@
exit 1
