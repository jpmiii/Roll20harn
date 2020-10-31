param (
    [string]$campaign = $(throw "-campaign is required."), 
    [string]$script = $(throw "-script number is required."),
    [string]$email = $(throw "-email is required."),
    [string]$password = $(throw "-password is required."),
    [string]$confignum = "none",
    [string]$dir = "..\",
    [string]$config = "..\config.js",
    [string]$pa = "false",
    [string]$bgi = "none",
    [string]$aci = "true"
)
$postParams = @{email=$email;password=$password}
$LoginResponse = Invoke-WebRequest -Uri https://app.roll20.net/sessions/create -Method POST -Body $postParams -SessionVariable 'Session'

$Javascript = Get-Content -Path $dir* -Filter *.js -Exclude config.js | Out-String
$html = Get-Content -Path $dir* -Filter *.html | Out-String
$css = Get-Content -Path $dir* -Filter *.css | Out-String

$date = Get-Date

$html = "<!-- $date -->`n$html"

if ($confignum -eq $script) {
	$configout = Get-Content -Path $config | Out-String
	$configout = "//`n//  $date`n$configout"
	$Javascript = "$configout`n$Javascript"
} elseif ($confignum -ne "none") {
	$configout = Get-Content -Path $config | Out-String
	$configout = "//`n//  $date`n$configout"
	$params3 = @{name='config.js';content=$configout}
	$PublishResponse = Invoke-WebRequest "https://app.roll20.net/campaigns/save_script/$campaign/$confignum" -WebSession $Session -Method POST -Body $params3
	$Javascript = "//`n//  $date`n$Javascript"
} else {
	$Javascript = "//`n//  $date`n$Javascript"
}


$publishParams = @{name='roll20harn.js';content=$Javascript}
$PublishResponse = Invoke-WebRequest "https://app.roll20.net/campaigns/save_script/$campaign/$script" -WebSession $Session -Method POST -Body $publishParams


$params2 = @{publicaccess=$pa;bgimage=$bgi;allowcharacterimport=$aci;charsheettype='custom';customcharsheet_layout=$html;customcharsheet_style=$css}
$PublishResponse = Invoke-WebRequest "https://app.roll20.net/campaigns/savesettings/$campaign" -WebSession $Session -Method POST -Body $params2


Write-Host "Done. You must Now restart your API Script Host"