# PowerShell script to automatically increment version numbers
param(
    [string]$VersionType = "patch"  # patch, minor, major
)

# Get current directory
$projectDir = Get-Location

# Define file patterns to search
$htmlFiles = @(
    "index.html",
    "gallery.html", 
    "contact.html",
    "prom.html",
    "prom-register.html",
    "bg\index.html",
    "bg\gallery.html",
    "bg\contact.html",
    "bg\prom.html",
    "bg\prom-register.html"
)

# Find current version number from any file
$currentVersion = $null
foreach ($file in $htmlFiles) {
    $filePath = Join-Path $projectDir $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        if ($content -match 'script\.js\?v=(\d+)\.(\d+)\.(\d+)') {
            $currentVersion = @{
                Major = [int]$matches[1]
                Minor = [int]$matches[2]
                Patch = [int]$matches[3]
            }
            break
        }
    }
}

# If no version found, start with 1.0.0
if (-not $currentVersion) {
    $currentVersion = @{ Major = 1; Minor = 0; Patch = 0 }
}

# Increment version based on type
switch ($VersionType.ToLower()) {
    "major" { 
        $currentVersion.Major++
        $currentVersion.Minor = 0
        $currentVersion.Patch = 0
    }
    "minor" { 
        $currentVersion.Minor++
        $currentVersion.Patch = 0
    }
    default { # patch
        $currentVersion.Patch++
    }
}

# Create new version string
$newVersion = "$($currentVersion.Major).$($currentVersion.Minor).$($currentVersion.Patch)"

Write-Host "Updating version to: $newVersion" -ForegroundColor Green

# Update all files
$filesUpdated = 0
foreach ($file in $htmlFiles) {
    $filePath = Join-Path $projectDir $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Update CSS version
        $content = $content -replace 'styles\.css\?v=[\d\.]+', "styles.css?v=$newVersion"
        
        # Update JS version  
        $content = $content -replace 'script\.js\?v=[\d\.]+', "script.js?v=$newVersion"
        
        # Write back to file
        $content | Set-Content $filePath -NoNewline
        
        Write-Host "Updated: $file" -ForegroundColor Yellow
        $filesUpdated++
    }
}

Write-Host "$filesUpdated files updated successfully!" -ForegroundColor Green
Write-Host "New version: $newVersion" -ForegroundColor Cyan

# Optional: Auto-commit to git
$autoCommit = Read-Host "Do you want to commit these changes to git? (y/N)"
if ($autoCommit -eq 'y' -or $autoCommit -eq 'Y') {
    git add .
    git commit -m "Update version numbers to $newVersion"
    Write-Host "Changes committed to git!" -ForegroundColor Green
    
    $autoPush = Read-Host "Do you want to push to remote? (y/N)"
    if ($autoPush -eq 'y' -or $autoPush -eq 'Y') {
        git push
        Write-Host "Changes pushed to remote!" -ForegroundColor Green
    }
}