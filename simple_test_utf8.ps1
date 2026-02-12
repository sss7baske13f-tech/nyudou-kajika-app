# エンコーディングを指定した日記生成テスト
$charPath = "C:\Users\sw7ba\.gemini\antigravity\scratch\nyudou-kajika-app\mock_characters.json"
$tmplPath = "C:\Users\sw7ba\.gemini\antigravity\brain\fcdcd3ef-dcb7-4671-95b3-f48e92500188\templates.json"

$charRaw = Get-Content -Path $charPath -Encoding UTF8 -Raw
$tmplRaw = Get-Content -Path $tmplPath -Encoding UTF8 -Raw

$chars = $charRaw | ConvertFrom-Json
$tmpls = $tmplRaw | ConvertFrom-Json

if ($null -eq $chars -or $null -eq $tmpls) {
    Write-Error "JSON の読み込みに失敗しました。"
    exit
}

$c = $chars[0]
$t = $tmpls[4] # ニュウドウカジカ向けのテンプレート

$dateStr = Get-Date -Format 'yyyy/MM/dd'
$content = $t.template -replace '\{name\}', $c.name

Write-Host "=== Encoding Corrected Test ==="
Write-Host "Date: $dateStr"
Write-Host "Name: $($c.name)"
Write-Host "Content: $content"
