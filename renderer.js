document.getElementById('process-btn').addEventListener('click', async () => {
    const inputDir = 'This PC\\Apple iPhone\\Internal Storage\\DCIM'; // Change this to your actual path
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.mov'];
    const filePaths = getAllFiles(inputDir, supportedFormats);

    const processedFiles = await window.electronAPI.processFiles(filePaths);
    displayFiles(processedFiles);
});

function getAllFiles(dir, formats) {
    let results = [];

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(file, formats));
        } else {
            if (formats.includes(path.extname(file).toLowerCase())) {
                results.push(file);
            }
        }
    });

    return results;
}

function displayFiles(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        fileList.appendChild(li);
    });
}
