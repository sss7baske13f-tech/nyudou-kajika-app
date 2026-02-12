# Pure ASCII script to avoid encoding issues
$charPath = "C:\Users\sw7ba\.gemini\antigravity\scratch\nyudou-kajika-app\mock_characters.json"
$tmplPath = "C:\Users\sw7ba\.gemini\antigravity\brain\fcdcd3ef-dcb7-4671-95b3-f48e92500188\templates.json"

# Load JSON with UTF8 encoding
$charRaw = Get-Content -Path $charPath -Encoding UTF8 -Raw
$tmplRaw = Get-Content -Path $tmplPath -Encoding UTF8 -Raw

$chars = $charRaw | ConvertFrom-Json
$tmpls = $tmplRaw | ConvertFrom-Json

function Get-Diary {
    param($Character, $Templates)
    
    $matches = @()
    foreach ($t in $Templates) {
        $sMatch = ($t.species_tag -eq 'any' -or $t.species_tag -eq $Character.species_tag)
        $tMatch = $false
        foreach ($trait in $t.traits) {
            if ($Character.traits -contains $trait) { $tMatch = $true; break }
        }
        if ($sMatch -and $tMatch) { $matches += $t }
    }

    if ($matches.Count -eq 0) {
        return "No template found."
    }

    $selected = $matches | Get-Random
    $replaced = $selected.template -replace '\{name\}', $Character.name
    return $replaced
}

Write-Host "--- Deep Sea Diary Prototype Results ---"
foreach ($c in $chars) {
    $result = Get-Diary -Character $c -Templates $tmpls
    Write-Host "Character: $($c.name)"
    Write-Host "Diary: $result"
    Write-Host "---"
}
