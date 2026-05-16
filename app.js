// 全局变量
let uploadedFiles = [];

// 初始化
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
    document.getElementById('renameBtn').addEventListener('click', showPaymentModal);
    
    // 下载按钮
    document.getElementById('downloadBtn').addEventListener('click', downloadFiles);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
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
    const fileList = document.getElementById('fileList');
    const previewList = document.getElementById('previewList');
    
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name)) {
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
            <span>${item.name}</span>
            <button onclick="removeFile(${index})">×</button>
        </div>
    `).join('');
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    updatePreview();
}

function clearFiles() {
    uploadedFiles = [];
    renderFileList();
    updatePreview();
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
        name = name.replace(new RegExp(rules.replaceOld, 'g'), rules.replaceNew);
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

function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

function showPaymentModal() {
    if (uploadedFiles.length === 0) {
        alert('请先上传文件');
        return;
    }
    
    document.getElementById('fileCount').textContent = uploadedFiles.length;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function confirmPayment() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    
    alert('感谢您的支付！正在处理您的文件...');
    
    setTimeout(() => {
        renameFiles();
    }, 1000);
}

function renameFiles() {
    const rules = getRules();
    
    // 生成新文件名
    const renamedFiles = uploadedFiles.map((item, index) => {
        const newName = generateNewName(item.name, index, rules);
        return {
            file: item.file,
            originalName: item.name,
            newName: newName
        };
    });
    
    // 保存到全局供下载使用
    window.renamedFiles = renamedFiles;
    
    // 显示成功弹窗
    document.getElementById('successCount').textContent = renamedFiles.length;
    document.getElementById('successModal').style.display = 'flex';
}

function downloadFiles() {
    const renamedFiles = window.renamedFiles || [];
    
    if (renamedFiles.length === 0) {
        alert('没有可下载的文件');
        return;
    }
    
    // 创建ZIP文件（简化版本，实际需要JSZip库）
    alert('准备下载...');
    
    // 对于单个文件，直接下载
    if (renamedFiles.length === 1) {
        downloadSingleFile(renamedFiles[0]);
    } else {
        // 对于多个文件，模拟打包下载
        alert(`已准备好 ${renamedFiles.length} 个文件的下载包`);
        // 实际项目中需要使用JSZip库来创建ZIP
    }
    
    // 关闭弹窗
    document.getElementById('successModal').style.display = 'none';
}

function downloadSingleFile(item) {
    const url = URL.createObjectURL(item.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 点击模态框外部关闭
document.getElementById('paymentModal').addEventListener('click', function(e) {
    if (e.target === this) closePaymentModal();
});

document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});