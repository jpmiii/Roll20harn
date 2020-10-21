param (
    [string]$campaign = $(throw "-campaign is required."), 
    [string]$script = $(throw "-script is required."),
    [string]$email = $(throw "-email is required."),
    [string]$password = $(throw "-password is required.")
)
$postParams = @{email=$email;password=$password}
$LoginResponse = Invoke-WebRequest -Uri https://app.roll20.net/sessions/create -Method POST -Body $postParams -SessionVariable 'Session'
$Javascript = Get-Content -Path .\* -Filter *.js | Out-String
$publishParams = @{name='roll20harn.js';content=$Javascript}

$PublishResponse = Invoke-WebRequest "https://app.roll20.net/campaigns/save_script/$campaign/$script" -WebSession $Session -Method POST -Body $publishParams
