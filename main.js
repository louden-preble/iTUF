const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('process-files', async (event, filePaths) => {
    const processedFiles = [];

    for (const filePath of filePaths) {
        const ext = path.extname(filePath).toLowerCase();
        const baseName = path.basename(filePath, ext);
        const outputDir = path.join(path.dirname(filePath), 'converted');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const outputFilePath = path.join(outputDir, `${baseName}.jpg`);
            await sharp(filePath)
                .jpeg()
                .toFile(outputFilePath);
            processedFiles.push(outputFilePath);
        } else if (ext === '.mov') {
            const outputFilePath = path.join(outputDir, `${baseName}.mp4`);
            await new Promise((resolve, reject) => {
                ffmpeg(filePath)
                    .output(outputFilePath)
                    .on('end', resolve)
                    .on('error', reject)
                    .run();
            });
            processedFiles.push(outputFilePath);
        }
    }

    return processedFiles;
});
