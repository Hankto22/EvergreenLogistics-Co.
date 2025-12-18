# Map screenshots to extracted video frames by average color
Add-Type -AssemblyName System.Drawing

# Use absolute paths (script may run from different CWD)
$root = (Resolve-Path (Join-Path $PSScriptRoot "..\.." )).Path
$assetsDir = Join-Path $root "src\assets"
$framesDir = Join-Path $assetsDir "frames"

function Get-AvgColor($path) {
  $bmp = [System.Drawing.Bitmap]::FromFile($path)
  $w = $bmp.Width; $h = $bmp.Height
  $step = 10
  $r=0; $g=0; $b=0; $count=0
  for ($x=0; $x -lt $w; $x += $step) {
    for ($y=0; $y -lt $h; $y += $step) {
      try {
        $c = $bmp.GetPixel($x,$y)
        $r += $c.R; $g += $c.G; $b += $c.B; $count++
      } catch { }
    }
  }
  $bmp.Dispose()
  if ($count -eq 0) { return @{R=0;G=0;B=0} }
  return @{R=[math]::Round($r/$count); G=[math]::Round($g/$count); B=[math]::Round($b/$count)}
}

# Collect screenshots (exclude frames folder)
$allImages = Get-ChildItem -Path $assetsDir -Include *.png,*.jpg,*.jpeg -File -Recurse | Where-Object { $_.DirectoryName -notmatch "\\frames$" }
$frames = @()
if (Test-Path $framesDir) { $frames = Get-ChildItem -Path $framesDir -Include *.jpg,*.jpeg -File -ErrorAction SilentlyContinue }

$imagesMeta = @()
foreach ($img in $allImages) {
  try {
    $bmp = [System.Drawing.Image]::FromFile($img.FullName)
    $w = $bmp.Width; $h = $bmp.Height
    $bmp.Dispose()
  } catch {
    $w = $null; $h = $null
  }
  $avg = Get-AvgColor $img.FullName
  $imagesMeta += [PSCustomObject]@{ Name = $img.Name; FullName = $img.FullName; Width = $w; Height = $h; Avg = $avg }
}

$framesMeta = @()
foreach ($f in $frames) {
  $avg = Get-AvgColor $f.FullName
  $framesMeta += [PSCustomObject]@{ Name = $f.Name; FullName = $f.FullName; Avg = $avg }
}

# For each screenshot find nearest frame by Euclidean distance in RGB space
$mapping = @()
foreach ($img in $imagesMeta) {
  $best = $null; $bestDist = [double]::MaxValue
  foreach ($f in $framesMeta) {
    $dr = $img.Avg.R - $f.Avg.R; $dg = $img.Avg.G - $f.Avg.G; $db = $img.Avg.B - $f.Avg.B
    $dist = [math]::Sqrt($dr*$dr + $dg*$dg + $db*$db)
    if ($dist -lt $bestDist) { $bestDist = $dist; $best = $f }
  }
  $mapping += [PSCustomObject]@{ Screenshot = $img.Name; ScreenshotPath = $img.FullName; Width = $img.Width; Height = $img.Height; MatchedFrame = if ($best) { $best.Name } else { $null }; Distance = [math]::Round($bestDist,2) }
}

$mapping | ConvertTo-Json -Depth 4
