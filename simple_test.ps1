# シンプルな日記生成テスト
$chars = Get-Content -Path "C:\Users\sw7ba\.gemini\antigravity\scratch\nyudou-kajika-app\mock_characters.json" -Raw | ConvertFrom-Json
$tmpls = Get-Content -Path "C:\Users\sw7ba\.gemini\antigravity\brain\fcdcd3ef-dcb7-4671-95b3-f48e92500188\templates.json" -Raw | ConvertFrom-Json

$c = $chars[0]
$t = $tmpls[4] # ニュウドウカジカ向けのテンプレート

$dateStr = Get-Date -Format 'yyyy/MM/dd'
$content = $t.template -replace '\{name\}', $c.name

Write-Host "=== Simple Test ==="
Write-Host "Date: $dateStr"
Write-Host "Name: $($c.name)"
Write-Host "Content: $content"
