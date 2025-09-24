<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>屈光筛查 - 学生健康筛查系统</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <!-- 二维码扫描库 - 优先使用本地，备用在线版本 -->
  <script>
    // 尝试加载本地jsQR库，失败则加载在线版本
    function loadJsQR() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = './jsQR.js';
        script.onload = () => {
          console.log('✅ 本地jsQR库加载成功');
          resolve();
        };
        script.onerror = () => {
          console.log('⚠️ 本地jsQR库加载失败，尝试在线版本');
          const onlineScript = document.createElement('script');
          onlineScript.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
          onlineScript.onload = () => {
            console.log('✅ 在线jsQR库加载成功');
            resolve();
          };
          onlineScript.onerror = () => {
            console.error('❌ jsQR库加载失败');
            reject(new Error('无法加载jsQR库'));
          };
          document.head.appendChild(onlineScript);
        };
        document.head.appendChild(script);
      });
    }
    
    // 加载jsQR库
    loadJsQR().then(() => {
      // jsQR库加载成功后，加载二维码扫描功能
      if (typeof window.qrScannerLoaded === 'undefined') {
        const qrScript = document.createElement('script');
        qrScript.src = './qr-scanner.js';
        qrScript.onload = () => {
          console.log('✅ qr-scanner.js加载成功');
        };
        qrScript.onerror = () => {
          console.error('❌ qr-scanner.js加载失败');
        };
        document.head.appendChild(qrScript);
      } else {
        console.log('✅ qr-scanner.js已存在，无需重复加载');
      }
    }).catch(error => {
      console.error('jsQR库加载失败:', error);
      alert('二维码扫描功能无法使用，请检查网络连接');
    });
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 10px;
      -webkit-overflow-scrolling: touch;
    }
    .container {
      background: white;
      border-radius: 15px;
      padding: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      max-width: 1000px;
      margin: 0 auto;
      width: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }
    .header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 1.6em;
      font-weight: 600;
    }
    .header .subtitle {
      color: #666;
      font-size: 0.95em;
      line-height: 1.4;
    }
    .back-btn {
      position: fixed;
      top: 15px;
      left: 15px;
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      z-index: 100;
      -webkit-tap-highlight-color: transparent;
    }
    .back-btn:active {
      transform: scale(0.95);
    }
    .back-btn:hover {
      background: #5a6fd8;
    }
    .step {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 12px;
      background: #f8f9fa;
    }
    .step-title {
      font-size: 1.3em;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .step-number {
      background: #667eea;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 0.9em;
    }
    .bluetooth-section {
      background: #fff3cd;
      border: 2px solid #ffeaa7;
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .bluetooth-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      font-weight: bold;
    }
    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .status-connected {
      background: #28a745;
    }
    .status-disconnected {
      background: #dc3545;
    }
    .status-connecting {
      background: #ffc107;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }
    .btn:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }
    .btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    .btn-success {
      background: #28a745;
    }
    .btn-success:hover {
      background: #218838;
    }
    .btn-danger {
      background: #dc3545;
    }
    .btn-danger:hover {
      background: #c82333;
    }
    .log-section {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      padding: 15px;
      margin: 15px 0;
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.4;
    }
    .uid-input-section {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    .uid-input {
      flex: 1;
      min-width: 200px;
      padding: 12px 15px;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }
    .uid-input:focus {
      outline: none;
      border-color: #667eea;
    }
    .student-info {
      background: #e8f4fd;
      border: 2px solid #b3d9ff;
      border-radius: 15px;
      padding: 20px;
      margin: 20px 0;
      display: none;
    }
    .student-info.show {
      display: block;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #d1ecf1;
    }
    .info-label {
      font-weight: bold;
      color: #0c5460;
    }
    .info-value {
      color: #333;
    }
    .form-section {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 15px;
      padding: 25px;
      margin-top: 20px;
    }
    .eye-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .eye-section {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 15px;
    }
    .eye-title {
      font-size: 1.2em;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .eye-icon {
      font-size: 1.5em;
      margin-right: 10px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-label {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
      font-size: 1em;
    }
    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }
    .form-input:focus {
      outline: none;
      border-color: #667eea;
    }
    .input-group {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: end;
    }
    .unit {
      background: #f8f9fa;
      padding: 10px 12px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      color: #666;
      font-weight: bold;
      font-size: 14px;
    }
    .data-display {
      background: #e8f5e8;
      border: 2px solid #c3e6c3;
      border-radius: 10px;
      padding: 15px;
      margin: 15px 0;
      display: none;
    }
    .data-display.show {
      display: block;
    }
    .data-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #d4edda;
    }
    .data-item:last-child {
      border-bottom: none;
    }
    .data-label {
      font-weight: bold;
      color: #155724;
    }
    .data-value {
      color: #333;
    }
    .submit-section {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
    }
    .submit-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .submit-btn:hover {
      background: #218838;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .loading {
      display: none;
      text-align: center;
      color: #666;
      margin: 20px 0;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 10px;
      margin: 15px 0;
      display: none;
    }
    .error.show {
      display: block;
    }
    .warning {
      background: #fff3cd;
      color: #856404;
      padding: 15px;
      border-radius: 10px;
      margin: 15px 0;
      display: none;
    }
    .warning.show {
      display: block;
    }
    .qr-scanner-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .qr-scanner-modal.show {
      display: flex;
    }
    .qr-scanner-container {
      background: white;
      border-radius: 15px;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      text-align: center;
    }
    .qr-scanner-video {
      width: 100%;
      max-width: 400px;
      border-radius: 10px;
      margin: 15px 0;
    }
    .qr-scanner-controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 15px;
    }
    .qr-scanner-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 250px;
      border: 2px solid #667eea;
      border-radius: 15px;
      pointer-events: none;
    }
    .qr-scanner-overlay::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid #667eea;
      border-radius: 15px;
      animation: scanPulse 2s infinite;
    }
    @keyframes scanPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    /* 平板适配 */
    @media (min-width: 768px) {
      .container {
        padding: 25px;
        border-radius: 20px;
      }
      .header {
        margin-bottom: 30px;
        padding-bottom: 20px;
      }
      .header h1 {
        font-size: 2em;
        margin-bottom: 10px;
      }
      .header .subtitle {
        font-size: 1.1em;
      }
      .back-btn {
        position: absolute;
        top: 30px;
        left: 30px;
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 25px;
      }
      .step {
        margin-bottom: 30px;
        padding: 20px;
        border-radius: 15px;
      }
      .eye-grid {
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 25px;
      }
      .eye-section {
        padding: 20px;
        border-radius: 15px;
      }
    }
    
    /* 大屏适配 */
    @media (min-width: 1024px) {
      .container {
        padding: 30px;
      }
      .header h1 {
        font-size: 2.2em;
      }
      .eye-grid {
        gap: 35px;
        margin-bottom: 30px;
      }
    }
  </style>
</head>
<body>
  <button class="back-btn" onclick="goBack()">← 返回主页</button>
  
  <div class="container">
    <div class="header">
      <h1>🔬 屈光筛查</h1>
      <p class="subtitle">使用蓝牙设备检测屈光状态，记录球镜、柱镜、轴向等数据</p>
    </div>

    <!-- 步骤1: 蓝牙连接 -->
    <div class="step">
      <div class="step-title">
        <div class="step-number">1</div>
        连接蓝牙设备
      </div>
      <div class="bluetooth-section">
        <div class="bluetooth-status">
          <div class="status-indicator">
            <div class="status-dot status-disconnected" id="statusDot"></div>
            <span id="statusText">设备未连接</span>
          </div>
          <div>
            <button class="btn" id="connectBtn" onclick="connectBluetooth()">🔗 连接设备</button>
            <button class="btn btn-danger" id="disconnectBtn" onclick="disconnectBluetooth()" style="display: none;">❌ 断开连接</button>
          </div>
        </div>
        <div class="log-section" id="bluetoothLog">
          <div>等待连接蓝牙设备...</div>
        </div>
      </div>
      <div class="warning" id="bluetoothWarning">
        ⚠️ 请先连接蓝牙设备才能进行屈光检测
      </div>
    </div>

    <!-- 步骤2: 输入学生UID -->
    <div class="step">
      <div class="step-title">
        <div class="step-number">2</div>
        输入学生UID
      </div>
      <div class="uid-input-section">
        <input type="text" id="uidInput" class="uid-input" placeholder="请输入或扫描学生UID" maxlength="20">
        <button class="btn" onclick="scanQRWithCheck()">📷 扫码</button>
        <button class="btn" onclick="getStudentInfo()" id="searchBtn" disabled>🔍 查询</button>
      </div>
      <div class="error" id="uidError"></div>
      <div class="loading" id="uidLoading">正在查询学生信息...</div>
    </div>

    <!-- 学生信息展示 -->
    <div class="student-info" id="studentInfo">
      <div class="step-title">
        <div class="step-number">3</div>
        学生信息确认
      </div>
      <div class="info-grid" id="studentInfoGrid"></div>
    </div>

    <!-- 数据填写表单 -->
    <div class="form-section" id="dataForm" style="display: none;">
      <div class="step-title">
        <div class="step-number">4</div>
        屈光检测数据
      </div>
      
      <!-- 蓝牙数据展示 -->
      <div class="data-display" id="bluetoothData">
        <h4>📡 蓝牙设备数据</h4>
        <div id="bluetoothDataContent"></div>
      </div>
      
      <form id="refractionForm">
        <div class="eye-grid">
          <!-- 左眼 -->
          <div class="eye-section">
            <div class="eye-title">
              <span class="eye-icon">👁️</span>
              左眼 (OS)
            </div>
            
            <div class="form-group">
              <label class="form-label">球镜 (Sph)</label>
              <div class="input-group">
                <input type="number" id="leftSphere" class="form-input" placeholder="球镜度数" min="-20" max="20" step="0.25">
                <div class="unit">D</div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">柱镜 (Cyl)</label>
              <div class="input-group">
                <input type="number" id="leftCylinder" class="form-input" placeholder="柱镜度数" min="-6" max="6" step="0.25">
                <div class="unit">D</div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">轴向 (Axis)</label>
              <div class="input-group">
                <input type="number" id="leftAxis" class="form-input" placeholder="轴向角度" min="0" max="180" step="1">
                <div class="unit">°</div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">视力</label>
              <input type="text" id="leftVision" class="form-input" placeholder="视力值">
            </div>
            
            <div class="form-group">
              <label class="form-label">备注</label>
              <textarea id="leftNotes" class="form-input" placeholder="左眼检测备注" rows="2"></textarea>
            </div>
          </div>

          <!-- 右眼 -->
          <div class="eye-section">
            <div class="eye-title">
              <span class="eye-icon">👁️</span>
              右眼 (OD)
            </div>
            
            <div class="form-group">
              <label class="form-label">球镜 (Sph)</label>
              <div class="input-group">
                <input type="number" id="rightSphere" class="form-input" placeholder="球镜度数" min="-20" max="20" step="0.25">
                <div class="unit">D</div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">柱镜 (Cyl)</label>
              <div class="input-group">
                <input type="number" id="rightCylinder" class="form-input" placeholder="柱镜度数" min="-6" max="6" step="0.25">
                <div class="unit">D</div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">轴向 (Axis)</label>
              <div class="input-group">
                <input type="number" id="rightAxis" class="form-input" placeholder="轴向角度" min="0" max="180" step="1">
                <div class="unit">°</div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">视力</label>
              <input type="text" id="rightVision" class="form-input" placeholder="视力值">
            </div>
            
            <div class="form-group">
              <label class="form-label">备注</label>
              <textarea id="rightNotes" class="form-input" placeholder="右眼检测备注" rows="2"></textarea>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">整体备注</label>
          <textarea id="overallNotes" class="form-input" placeholder="整体检测备注信息" rows="3"></textarea>
        </div>
        
        <div class="submit-section">
          <button type="submit" class="submit-btn" id="submitBtn">✅ 提交数据</button>
        </div>
      </form>
      
      <div class="loading" id="submitLoading">正在提交数据...</div>
      <div class="error" id="submitError"></div>
    </div>
  </div>

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

  <script>
    let currentStudent = null;
    let bluetoothDevice = null;
    let bluetoothServer = null;
    let bluetoothCharacteristic = null;
    let isConnected = false;
    
    // 二维码扫描相关变量（避免与qr-scanner.js冲突）
    // let qrStream = null;
    // let qrCurrentCamera = 'environment';

    // 返回主页
    function goBack() {
      if (isConnected) {
        disconnectBluetooth();
      }
      window.location.href = 'index.html';
    }

    // 蓝牙连接功能
    async function connectBluetooth() {
      try {
        updateStatus('connecting', '正在连接...');
        logBluetooth('🔍 正在搜索设备...');
        
        bluetoothDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['0000180d-0000-1000-8000-00805f9b34fb', '00001800-0000-1000-8000-00805f9b34fb'] // SW801设备的具体服务UUID
        });

        logBluetooth('✅ 选择设备: ' + bluetoothDevice.name);
        bluetoothServer = await bluetoothDevice.gatt.connect();
        logBluetooth('🔗 已连接: ' + bluetoothDevice.name);
        
        // 监听设备断开事件
        bluetoothDevice.addEventListener('gattserverdisconnected', onBluetoothDisconnected);

        const services = await bluetoothServer.getPrimaryServices();
        logBluetooth('📡 发现服务数量: ' + services.length);

        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          for (const char of characteristics) {
            logBluetooth('➡️ 特征: ' + char.uuid);

            // 专门监听SW801设备的心率控制点特征 (0x2A39)
            if (char.uuid === '00002a39-0000-1000-8000-00805f9b34fb' && char.properties.notify) {
              await char.startNotifications();
              char.addEventListener("characteristicvaluechanged", onBluetoothDataReceived);
              bluetoothCharacteristic = char;
              logBluetooth('🔔 已订阅SW801心率控制点特征变化: ' + char.uuid);
            }
          }
        }
        
        updateStatus('connected', '设备已连接');
        document.getElementById('connectBtn').style.display = 'none';
        document.getElementById('disconnectBtn').style.display = 'inline-block';
        document.getElementById('searchBtn').disabled = false;
        document.getElementById('bluetoothWarning').classList.remove('show');
        isConnected = true;
        
      } catch (error) {
        updateStatus('disconnected', '连接失败');
        logBluetooth('❌ 出错: ' + error);
        console.error('Bluetooth connection error:', error);
      }
    }

    // 蓝牙断开连接
    function disconnectBluetooth() {
      if (bluetoothCharacteristic) {
        try {
          bluetoothCharacteristic.stopNotifications();
        } catch (error) {
          console.error('Error stopping notifications:', error);
        }
      }
      
      if (bluetoothServer && bluetoothServer.connected) {
        bluetoothServer.disconnect();
      }
      
      onBluetoothDisconnected();
    }

    // 蓝牙断开事件处理
    function onBluetoothDisconnected() {
      updateStatus('disconnected', '设备已断开');
      document.getElementById('connectBtn').style.display = 'inline-block';
      document.getElementById('disconnectBtn').style.display = 'none';
      document.getElementById('searchBtn').disabled = true;
      document.getElementById('bluetoothWarning').classList.add('show');
      document.getElementById('bluetoothData').classList.remove('show');
      logBluetooth('❌ 设备已断开连接');
      
      bluetoothDevice = null;
      bluetoothServer = null;
      bluetoothCharacteristic = null;
      isConnected = false;
    }

    // 更新连接状态
    function updateStatus(status, text) {
      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');
      
      statusDot.className = 'status-dot status-' + status;
      statusText.textContent = text;
    }

    // 蓝牙日志
    function logBluetooth(message) {
      const logEl = document.getElementById('bluetoothLog');
      const time = new Date().toLocaleTimeString();
      logEl.innerHTML += `<div>[${time}] ${message}</div>`;
      logEl.scrollTop = logEl.scrollHeight;
    }

    // 蓝牙数据接收
    function onBluetoothDataReceived(event) {
      const decoder = new TextDecoder();
      const value = decoder.decode(event.target.value);
      logBluetooth('📩 收到数据: ' + value);

      try {
        const json = JSON.parse(value);
        displayBluetoothData(json);
        logBluetooth('📝 JSON解析成功');
      } catch {
        logBluetooth('⚠️ 非JSON数据: ' + value);
      }
    }

    // 显示蓝牙数据
    function displayBluetoothData(data) {
      const dataContent = document.getElementById('bluetoothDataContent');
      const dataDisplay = document.getElementById('bluetoothData');
      
      if (!data.leftEye || !data.rightEye) {
        dataContent.innerHTML = '<div style="color: #856404;">⚠️ 数据格式不正确</div>';
        dataDisplay.classList.add('show');
        return;
      }

      const left = data.leftEye;
      const right = data.rightEye;
      const time = new Date(data.timestamp || Date.now()).toLocaleString();

      dataContent.innerHTML = `
        <div class="data-item">
          <span class="data-label">检测时间:</span>
          <span class="data-value">${time}</span>
        </div>
        <div class="data-item">
          <span class="data-label">左眼球镜:</span>
          <span class="data-value">${left.sphere} D</span>
        </div>
        <div class="data-item">
          <span class="data-label">左眼柱镜:</span>
          <span class="data-value">${left.cylinder} D</span>
        </div>
        <div class="data-item">
          <span class="data-label">左眼轴向:</span>
          <span class="data-value">${left.axis}°</span>
        </div>
        <div class="data-item">
          <span class="data-label">左眼视力:</span>
          <span class="data-value">${left.vision}</span>
        </div>
        <div class="data-item">
          <span class="data-label">右眼球镜:</span>
          <span class="data-value">${right.sphere} D</span>
        </div>
        <div class="data-item">
          <span class="data-label">右眼柱镜:</span>
          <span class="data-value">${right.cylinder} D</span>
        </div>
        <div class="data-item">
          <span class="data-label">右眼轴向:</span>
          <span class="data-value">${right.axis}°</span>
        </div>
        <div class="data-item">
          <span class="data-label">右眼视力:</span>
          <span class="data-value">${right.vision}</span>
        </div>
      `;
      
      dataDisplay.classList.add('show');
      
      // 自动填充表单
      document.getElementById('leftSphere').value = left.sphere || '';
      document.getElementById('leftCylinder').value = left.cylinder || '';
      document.getElementById('leftAxis').value = left.axis || '';
      document.getElementById('leftVision').value = left.vision || '';
      
      document.getElementById('rightSphere').value = right.sphere || '';
      document.getElementById('rightCylinder').value = right.cylinder || '';
      document.getElementById('rightAxis').value = right.axis || '';
      document.getElementById('rightVision').value = right.vision || '';
    }

    // 二维码扫描功能已通过qr-scanner.js提供

    // 获取学生信息
    async function getStudentInfo() {
      if (!isConnected) {
        showError('uidError', '请先连接蓝牙设备');
        return;
      }

      const uid = document.getElementById('uidInput').value.trim();
      if (!uid) {
        showError('uidError', '请输入学生UID');
        return;
      }

      const loadingEl = document.getElementById('uidLoading');
      const errorEl = document.getElementById('uidError');
      const searchBtn = document.getElementById('searchBtn');
      
      loadingEl.style.display = 'block';
      errorEl.classList.remove('show');
      searchBtn.disabled = true;

      try {
        const response = await fetch(`https://schoolscreeing.aiforoptometry.com/api/exam/student-by-uid/?uid=${uid}`);
        const result = await response.json();
        
        if (result.ok && result.data) {
          currentStudent = result.data;
          displayStudentInfo(result.data);
          document.getElementById('dataForm').style.display = 'block';
        } else {
          showError('uidError', result.message || '未找到该学生信息');
        }
      } catch (error) {
        showError('uidError', '网络错误，请检查网络连接');
        console.error('Error:', error);
      } finally {
        loadingEl.style.display = 'none';
        searchBtn.disabled = false;
      }
    }

    // 显示学生信息
    function displayStudentInfo(student) {
      const infoGrid = document.getElementById('studentInfoGrid');
      infoGrid.innerHTML = `
        <div class="info-item">
          <span class="info-label">学号:</span>
          <span class="info-value">${student.student_no}</span>
        </div>
        <div class="info-item">
          <span class="info-label">姓名:</span>
          <span class="info-value">${student.name}</span>
        </div>
        <div class="info-item">
          <span class="info-label">性别:</span>
          <span class="info-value">${student.sex}</span>
        </div>
        <div class="info-item">
          <span class="info-label">学校:</span>
          <span class="info-value">${student.school}</span>
        </div>
        <div class="info-item">
          <span class="info-label">年级:</span>
          <span class="info-value">${student.grade}</span>
        </div>
        <div class="info-item">
          <span class="info-label">班级:</span>
          <span class="info-value">${student.class_name}</span>
        </div>
        <div class="info-item">
          <span class="info-label">学段:</span>
          <span class="info-value">${student.stage}</span>
        </div>
        <div class="info-item">
          <span class="info-label">UID:</span>
          <span class="info-value">${student.uid}</span>
        </div>
      `;
      
      document.getElementById('studentInfo').classList.add('show');
    }

    // 显示错误信息
    function showError(elementId, message) {
      const errorEl = document.getElementById(elementId);
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }

    // 提交表单
    document.getElementById('refractionForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!currentStudent) {
        showError('submitError', '请先查询学生信息');
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      const loadingEl = document.getElementById('submitLoading');
      const errorEl = document.getElementById('submitError');
      
      submitBtn.disabled = true;
      loadingEl.style.display = 'block';
      errorEl.classList.remove('show');

      const formData = {
        uid: currentStudent.uid,
        name: currentStudent.name,
        leftEye: {
          sphere: parseFloat(document.getElementById('leftSphere').value) || 0,
          cylinder: parseFloat(document.getElementById('leftCylinder').value) || 0,
          axis: parseFloat(document.getElementById('leftAxis').value) || 0,
          vision: document.getElementById('leftVision').value.trim(),
          notes: document.getElementById('leftNotes').value.trim()
        },
        rightEye: {
          sphere: parseFloat(document.getElementById('rightSphere').value) || 0,
          cylinder: parseFloat(document.getElementById('rightCylinder').value) || 0,
          axis: parseFloat(document.getElementById('rightAxis').value) || 0,
          vision: document.getElementById('rightVision').value.trim(),
          notes: document.getElementById('rightNotes').value.trim()
        },
        overallNotes: document.getElementById('overallNotes').value.trim(),
        timestamp: new Date().toISOString(),
        bluetoothConnected: isConnected
      };

      try {
        // 这里应该调用实际的提交API
        // const response = await fetch('/api/refraction/submit', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        // 模拟提交成功
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert(`✅ 数据提交成功！

学生: ${currentStudent.name}
左眼: 球镜${formData.leftEye.sphere}D, 柱镜${formData.leftEye.cylinder}D, 轴向${formData.leftEye.axis}°
右眼: 球镜${formData.rightEye.sphere}D, 柱镜${formData.rightEye.cylinder}D, 轴向${formData.rightEye.axis}°
检测时间: ${new Date().toLocaleString()}`);
        
        // 重置表单
        document.getElementById('refractionForm').reset();
        document.getElementById('uidInput').value = '';
        document.getElementById('studentInfo').classList.remove('show');
        document.getElementById('dataForm').style.display = 'none';
        document.getElementById('bluetoothData').classList.remove('show');
        currentStudent = null;
        
      } catch (error) {
        showError('submitError', '提交失败，请重试');
        console.error('Submit error:', error);
      } finally {
        submitBtn.disabled = false;
        loadingEl.style.display = 'none';
      }
    });

    // 回车键查询
    document.getElementById('uidInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        getStudentInfo();
      }
    });

    // 页面卸载时断开蓝牙连接
    window.addEventListener('beforeunload', function() {
      if (isConnected) {
        disconnectBluetooth();
      }
    });
  </script>
</body>
</html>
