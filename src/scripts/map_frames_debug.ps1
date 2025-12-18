Add-Type -AssemblyName System.Drawing

Write-Output "Counting frames and images..."
$frames = Get-ChildItem -Path "src\assets\frames" -Include *.jpg,*.jpeg -File -ErrorAction SilentlyContinue
Write-Output "Frames found: $($frames.Count)"
$imagesAll = Get-ChildItem -Path "src\assets" -Include *.png,*.jpg,*.jpeg -File -Recurse | Where-Object { $_.DirectoryName -notmatch "\\frames$" }
Write-Output "Images found: $($imagesAll.Count)"

function Get-AvgColor($path) {
  $bmp = [System.Drawing.Bitmap]::FromFile($path)
  $w = $bmp.Width; $h = $bmp.Height
  $step = 20
  $r=0; $g=0; $b=0; $count=0
  for ($x=0; $x -lt $w; $x += $step) {
    for ($y=0; $y -lt $h; $y += $step) {
      try { $c = $bmp.GetPixel($x,$y); $r += $c.R; $g += $c.G; $b += $c.B; $count++ } catch { }
    }
  }
  $bmp.Dispose()
  if ($count -eq 0) { return @{R=0;G=0;B=0} }
  return @{R=[math]::Round($r/$count); G=[math]::Round($g/$count); B=[math]::Round($b/$count)}
}

if ($frames.Count -eq 0) { Write-Output "No frames, exiting."; exit }

$frame0 = $frames | Select-Object -First 1
$avg0 = Get-AvgColor $frame0.FullName
Write-Output "Sample frame: $($frame0.Name) avg: $($avg0.R),$($avg0.G),$($avg0.B)"

$img0 = $imagesAll | Select-Object -First 1
$avgImg0 = Get-AvgColor $img0.FullName
Write-Output "Sample image: $($img0.Name) avg: $($avgImg0.R),$($avgImg0.G),$($avgImg0.B)"

# attempt one mapping for the first image
$best=null; $bestDist=[double]::MaxValue
foreach ($f in $frames) {
  $af = Get-AvgColor $f.FullName
  $dr = $avgImg0.R - $af.R; $dg = $avgImg0.G - $af.G; $db = $avgImg0.B - $af.B
  $dist = [math]::Sqrt($dr*$dr + $dg*$dg + $db*$db)
  if ($dist -lt $bestDist) { $bestDist = $dist; $best = $f }
}
Write-Output "Best match for $($img0.Name) -> $($best.Name) dist=$([math]::Round($bestDist,2))"
