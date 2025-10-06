function Reset-TypeScriptConfig {
    Set-Location "E:\PPIH\web"
    Write-Host "ðŸ”„ Resetting TypeScript configuration..." -ForegroundColor Yellow
    
    if (Test-Path "tsconfig.json") {
        Remove-Item "tsconfig.json" -Force
        Write-Host "âœ… Old tsconfig.json deleted" -ForegroundColor Green
    }

    @"
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["ES2015", "DOM"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"@ | Out-File "tsconfig.json" -Encoding UTF8

    Write-Host "âœ… New tsconfig.json created" -ForegroundColor Green
    npm install typescript @types/node --save-dev
    Write-Host "ðŸŽ‰ TypeScript configuration reset complete!" -ForegroundColor Green
    Write-Host "ðŸ”„ Restart VS Code and run: Ctrl+Shift+P -> 'TypeScript: Restart TS Server'" -ForegroundColor Yellow
}

Reset-TypeScriptConfig
