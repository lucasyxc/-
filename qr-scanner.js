// 防止重复加载
if (typeof window.qrScannerLoaded !== 'undefined') {
  console.log('qr-scanner.js 已加载，跳过重复加载');
} else {
  window.qrScannerLoaded = true;
  
  // 二维码扫描通用功能
  var qrStream = null;
  var qrCurrentCamera = 'environment'; // 'environment' 为后置摄像头，'user' 为前置摄像头

// 扫码功能（真实摄像头扫描）
async function scanQR() {
  try {
    // 检查浏览器是否支持摄像头
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('您的浏览器不支持摄像头功能');
      return;
    }

    // 显示扫码模态框
    document.getElementById('qrScannerModal').classList.add('show');
    
    // 获取摄像头权限并启动扫描
    await startQRScanning();
    
  } catch (error) {
    console.error('启动二维码扫描失败:', error);
    alert('启动摄像头失败: ' + error.message);
    closeQRScanner();
  }
}

// 启动二维码扫描
async function startQRScanning() {
  try {
    // 获取摄像头流
    qrStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: qrCurrentCamera,
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });

    const video = document.getElementById('qrScannerVideo');
    video.srcObject = qrStream;
    
    // 视频加载完成后开始扫描
    video.onloadedmetadata = () => {
      video.play();
      scanQRCode();
    };
    
  } catch (error) {
    console.error('获取摄像头失败:', error);
    alert('无法访问摄像头，请检查权限设置');
    closeQRScanner();
  }
}

// 扫描二维码
function scanQRCode() {
  const video = document.getElementById('qrScannerVideo');
  const canvas = document.getElementById('qrScannerCanvas');
  const ctx = canvas.getContext('2d');
  
  // 设置canvas尺寸
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // 绘制视频帧到canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // 使用jsQR库识别二维码
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  
  if (code) {
    // 找到二维码，处理结果
    handleQRCodeResult(code.data);
  } else {
    // 没找到二维码，继续扫描
    requestAnimationFrame(scanQRCode);
  }
}

// 处理二维码扫描结果
function handleQRCodeResult(qrData) {
  console.log('扫描到二维码:', qrData);
  
  // 关闭扫码界面
  closeQRScanner();
  
  // 将扫描结果填入UID输入框
  document.getElementById('uidInput').value = qrData;
  
  // 自动查询学生信息
  if (typeof getStudentInfo === 'function') {
    getStudentInfo();
  }
}

// 关闭二维码扫描器
function closeQRScanner() {
  // 停止摄像头流
  if (qrStream) {
    qrStream.getTracks().forEach(track => track.stop());
    qrStream = null;
  }
  
  // 隐藏模态框
  document.getElementById('qrScannerModal').classList.remove('show');
  
  // 清空视频源
  const video = document.getElementById('qrScannerVideo');
  video.srcObject = null;
}

// 切换摄像头
async function switchCamera() {
  // 关闭当前流
  if (qrStream) {
    qrStream.getTracks().forEach(track => track.stop());
  }
  
  // 切换摄像头
  qrCurrentCamera = qrCurrentCamera === 'environment' ? 'user' : 'environment';
  
  // 重新启动扫描
  await startQRScanning();
}

// 生成二维码扫描器的HTML
function generateQRScannerHTML() {
  return `
    <!-- 二维码扫描模态框 -->
    <div class="qr-scanner-modal" id="qrScannerModal">
      <div class="qr-scanner-container">
        <h3>📷 扫描二维码</h3>
        <p>请将二维码对准摄像头</p>
        <video id="qrScannerVideo" class="qr-scanner-video" autoplay muted playsinline></video>
        <canvas id="qrScannerCanvas" style="display: none;"></canvas>
        <div class="qr-scanner-overlay"></div>
        <div class="qr-scanner-controls">
          <button class="btn btn-danger" onclick="closeQRScanner()">❌ 关闭</button>
          <button class="btn" onclick="switchCamera()">🔄 切换摄像头</button>
        </div>
      </div>
    </div>
  `;
}

// 添加移动端优化的CSS样式
function addMobileOptimizedStyles() {
  if (document.getElementById('mobile-qr-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'mobile-qr-styles';
  style.textContent = `
    @media (max-width: 767px) {
      .qr-scanner-modal {
        padding: 10px;
      }
      .qr-scanner-container {
        padding: 15px;
        border-radius: 12px;
        max-width: 95%;
      }
      .qr-scanner-video {
        max-width: 100%;
        border-radius: 8px;
      }
      .qr-scanner-overlay {
        width: 200px;
        height: 200px;
      }
      .qr-scanner-controls {
        flex-direction: column;
        gap: 10px;
      }
      .qr-scanner-controls .btn {
        width: 100%;
        padding: 12px;
        font-size: 16px;
      }
    }
  `;
  document.head.appendChild(style);
}

// 初始化移动端样式
if (typeof document !== 'undefined') {
  addMobileOptimizedStyles();
}

// 检查jsQR库是否已加载
function checkJsQRAvailable() {
  return typeof jsQR !== 'undefined';
}

// 等待jsQR库加载完成
function waitForJsQR() {
  return new Promise((resolve, reject) => {
    if (checkJsQRAvailable()) {
      resolve();
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 50; // 最多等待5秒
    
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkJsQRAvailable()) {
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        reject(new Error('jsQR库加载超时'));
      }
    }, 100);
  });
}

// 修改扫码功能，添加jsQR库检查
async function scanQRWithCheck() {
  try {
    await waitForJsQR();
    await scanQR();
  } catch (error) {
    console.error('jsQR库未加载:', error);
    alert('二维码扫描功能暂时不可用，请刷新页面重试');
  }
}

// 导出带检查的扫码函数
if (typeof window !== 'undefined') {
  window.scanQRWithCheck = scanQRWithCheck;
}

} // 结束防重复加载的代码块
