// 批量文件重命名工具 - 完全免费版
let uploadedFiles = [];

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // 文件输入
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 规则变化时更新预览
    document.getElementById('prefix').addEventListener('input', updatePreview);
    document.getElementById('suffix').addEventListener('input', updatePreview);
    document.getElementById('addNumber').addEventListener('change', handleNumberToggle);
    document.getElementById('paddingSelect').addEventListener('change', updatePreview);
    document.getElementById('addDate').addEventListener('change', handleDateToggle);
    document.getElementById('dateFormat').addEventListener('change', updatePreview);
    document.getElementById('replaceOld').addEventListener('input', updatePreview);
    document.getElementById('replaceNew').addEventListener('input', updatePreview);
    
    // 操作按钮
    document.getElementById('clearBtn').addEventListener('click', clearFiles);
    document.getElementById('renameBtn').addEventListener('click', processRename);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
    // 清空 input 以便重复选择相同文件
    e.target.value = '';
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
}

function addFiles(files) {
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name && f.size === file.size)) {
            uploadedFiles.push({
                file: file,
                name: file.name,
                size: file.size,
                type: file.type
            });
        }
    });
    renderFileList();
    updatePreview();
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    fileList.innerHTML = uploadedFiles.map((item, index) => `
        <div class="file-item">
            <span>${item.name} (${formatSize(item.size)})</span>
            <button onclick="removeFile(${index})">×</button>
        </div>
    `).join('');
}

function formatSize(size) {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    updatePreview();
}

function clearFiles() {
    uploadedFiles = [];
    document.getElementById('previewList').innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">👆</span>
            <p>上传文件后预览重命名效果</p>
        </div>
    `;
    renderFileList();
}

function handleNumberToggle() {
    const numberPadding = document.getElementById('numberPadding');
    numberPadding.style.display = document.getElementById('addNumber').checked ? 'block' : 'none';
    updatePreview();
}

function handleDateToggle() {
    const dateFormat = document.getElementById('dateFormat');
    dateFormat.disabled = !document.getElementById('addDate').checked;
    dateFormat.style.opacity = dateFormat.disabled ? 0.5 : 1;
    updatePreview();
}

function updatePreview() {
    const previewList = document.getElementById('previewList');
    if (uploadedFiles.length === 0) {
        previewList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">👆</span>
                <p>上传文件后预览重命名效果</p>
            </div>
        `;
        return;
    }
    
    const rules = getRules();
    const previewItems = uploadedFiles.map((item, index) => {
        const newName = generateNewName(item.name, index, rules);
        return `
            <div class="preview-item">
                <span class="preview-old">${item.name}</span>
                <span class="preview-arrow">→</span>
                <span class="preview-new">${newName}</span>
            </div>
        `;
    }).join('');
    
    previewList.innerHTML = previewItems;
}

function getRules() {
    return {
        prefix: document.getElementById('prefix').value,
        suffix: document.getElementById('suffix').value,
        addNumber: document.getElementById('addNumber').checked,
        padding: parseInt(document.getElementById('paddingSelect').value),
        addDate: document.getElementById('addDate').checked,
        dateFormat: document.getElementById('dateFormat').value,
        replaceOld: document.getElementById('replaceOld').value,
        replaceNew: document.getElementById('replaceNew').value
    };
}

function generateNewName(originalName, index, rules) {
    const lastDotIndex = originalName.lastIndexOf('.');
    let name = lastDotIndex > -1 ? originalName.substring(0, lastDotIndex) : originalName;
    const ext = lastDotIndex > -1 ? originalName.substring(lastDotIndex) : '';
    
    // 替换文字
    if (rules.replaceOld && rules.replaceNew) {
        name = name.replace(new RegExp(escapeRegex(rules.replaceOld), 'g'), rules.replaceNew);
    }
    
    // 添加前缀
    if (rules.prefix) {
        name = rules.prefix + name;
    }
    
    // 添加后缀
    if (rules.suffix) {
        name = name + rules.suffix;
    }
    
    // 添加日期
    if (rules.addDate) {
        const date = new Date();
        const dateStr = formatDate(date, rules.dateFormat);
        name = name + '_' + dateStr;
    }
    
    // 添加序号
    if (rules.addNumber) {
        name = name + '_' + String(index + 1).padStart(rules.padding, '0');
    }
    
    return name + ext;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

function processRename() {
    if (uploadedFiles.length === 0) {
        alert('请先上传文件');
        return;
    }
    
    const rules = getRules();
    
    // 检查是否设置了任何规则
    if (!rules.prefix && !rules.suffix && !rules.addNumber && !rules.addDate && !rules.replaceOld) {
        alert('请至少设置一个重命名规则（前缀、后缀、序号、日期或替换）');
        return;
    }
    
    // 生成新文件名列表
    const renamedFiles = uploadedFiles.map((item, index) => {
        const newName = generateNewName(item.name, index, rules);
        return {
            file: item.file,
            originalName: item.name,
            newName: newName
        };
    });
    
    // 检查是否有重名冲突
    const newNames = renamedFiles.map(rf => rf.newName);
    const hasDuplicates = newNames.length !== new Set(newNames).size;
    if (hasDuplicates) {
        alert('⚠️ 重命名后有文件名冲突（存在相同文件名）\n请调整规则避免重复');
        return;
    }
    
    downloadAll(renamedFiles);
}

function downloadAll(renamedFiles) {
    const renameBtn = document.getElementById('renameBtn');
    renameBtn.disabled = true;
    renameBtn.textContent = '⏳ 处理中...';
    
    // 使用 setTimeout 让 UI 先更新
    setTimeout(() => {
        try {
            if (renamedFiles.length === 1) {
                // 单个文件直接下载
                downloadSingleFile(renamedFiles[0]);
            } else {
                // 多个文件打包成 ZIP
                downloadAsZip(renamedFiles);
            }
        } catch (e) {
            alert('下载出错：' + e.message);
        } finally {
            renameBtn.disabled = false;
            renameBtn.textContent = '立即重命名';
        }
    }, 100);
}

function downloadSingleFile(item) {
    // 使用新文件名下载原始文件内容
    const blob = item.file.slice(0, item.file.size, item.file.type);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function downloadAsZip(renamedFiles) {
    const zip = new JSZip();
    
    renamedFiles.forEach(item => {
        zip.file(item.newName, item.file);
    });
    
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        const zipName = '重命名文件_' + formatDate(new Date(), 'YYYYMMDD_HHmmss') + '.zip';
        saveAs(content, zipName);
    });
}

// 确保 saveAs 在全局可用
if (typeof window.saveAs === 'undefined') {
    window.saveAs = function(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
}
