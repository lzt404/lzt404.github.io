// 全局变量
let currentUser = null;
let selectedPlan = null;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 绑定表单提交事件
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 检查是否已登录
    checkLoginStatus();
});

// 显示登录模态框
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// 显示注册模态框
function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

// 显示支付模态框
function showPaymentModal() {
    document.getElementById('paymentModal').style.display = 'block';
}

// 显示二维码模态框
function showQRCodeModal() {
    document.getElementById('qrcodeModal').style.display = 'block';
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 切换到注册
function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

// 切换到登录
function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

// 滚动到服务区域
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// 处理注册
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // 验证密码确认
    if (data.password !== data.confirmPassword) {
        showMessage('密码和确认密码不匹配！', 'error');
        return;
    }
    
    // 保存注册信息到本地存储
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // 检查用户名是否已存在
    if (users.find(user => user.username === data.username)) {
        showMessage('用户名已存在，请选择其他用户名！', 'error');
        return;
    }
    
    // 添加注册时间
    data.registerTime = new Date().toLocaleString('zh-CN');
    delete data.confirmPassword; // 不保存确认密码
    
    users.push(data);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // 同时保存到控制台和显示文件（用于课程演示）
    console.log('=== 新用户注册 ===');
    console.log('用户名:', data.username);
    console.log('密码:', data.password);
    console.log('邮箱:', data.email);
    console.log('手机号:', data.phone);
    console.log('注册时间:', data.registerTime);
    console.log('==================');
    
    // 保存到数据文件
    saveUserDataToFile(data, 'register');
    
    showMessage('注册成功！用户信息已保存。请登录您的账户。', 'success');
    closeModal('registerModal');
    // 清空表单
    document.getElementById('registerForm').reset();
    // 自动切换到登录
    setTimeout(() => {
        showLoginModal();
    }, 1000);
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // 从本地存储获取用户数据
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.username === data.username && u.password === data.password);
    
    if (user) {
        currentUser = data.username;
        localStorage.setItem('currentUser', currentUser);
        
        // 记录登录信息
        console.log('=== 用户登录 ===');
        console.log('用户名:', data.username);
        console.log('密码:', data.password);
        console.log('登录时间:', new Date().toLocaleString('zh-CN'));
        console.log('===============');
        
        // 保存登录记录
        saveUserDataToFile({...data, loginTime: new Date().toLocaleString('zh-CN')}, 'login');
        
        showMessage('登录成功！', 'success');
        closeModal('loginModal');
        updateUIForLoggedInUser();
        // 清空表单
        document.getElementById('loginForm').reset();
    } else {
        showMessage('用户名或密码错误！请检查后重试。', 'error');
    }
}

// 选择方案
function selectPlan(planType, amount) {
    if (!currentUser) {
        showMessage('请先登录您的账户！', 'error');
        showLoginModal();
        return;
    }
    
    selectedPlan = {
        type: planType,
        amount: amount,
        bikeId: generateBikeId()
    };
    
    // 更新支付模态框信息
    document.getElementById('planType').textContent = getPlanTypeName(planType);
    document.getElementById('paymentAmount').textContent = amount;
    document.getElementById('bikeNumber').textContent = selectedPlan.bikeId;
    
    showPaymentModal();
}

// 生成单车ID
function generateBikeId() {
    return 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// 获取方案类型名称
function getPlanTypeName(type) {
    switch(type) {
        case 'single': return '按次计费';
        case 'monthly': return '月卡套餐';
        case 'yearly': return '年卡套餐';
        default: return '未知方案';
    }
}

// 处理支付
function processPayment() {
    if (!selectedPlan) {
        showMessage('请选择一个方案！', 'error');
        return;
    }
    
    // 记录支付信息
    const paymentData = {
        username: currentUser,
        amount: selectedPlan.amount,
        bikeId: selectedPlan.bikeId,
        planType: selectedPlan.type,
        paymentTime: new Date().toLocaleString('zh-CN')
    };
    
    console.log('=== 支付请求 ===');
    console.log('用户:', paymentData.username);
    console.log('金额:', paymentData.amount);
    console.log('方案:', getPlanTypeName(paymentData.planType));
    console.log('单车ID:', paymentData.bikeId);
    console.log('支付时间:', paymentData.paymentTime);
    console.log('===============');
    
    // 保存支付记录
    saveUserDataToFile(paymentData, 'payment');
    
    closeModal('paymentModal');
    
    // 更新二维码模态框信息
    document.getElementById('qrAmount').textContent = selectedPlan.amount;
    
    showQRCodeModal();
}

// 打开微信支付
function openWeChatPay() {
    const wechatUrl = 'wxp://f2f1IpkcegOSchfTqqtb4PoMRngHHhAuMhiriMM15BCgeHdG7jpu4INFAX6sY5HBD8DA';
    
    // 尝试直接打开微信链接
    try {
        window.location.href = wechatUrl;
    } catch (error) {
        // 如果无法直接打开，显示提示
        showMessage('请手动复制以下链接到微信中打开：' + wechatUrl, 'error');
        
        // 复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(wechatUrl).then(() => {
                showMessage('支付链接已复制到剪贴板！', 'success');
            });
        }
    }
    
    // 模拟支付完成
    setTimeout(() => {
        closeModal('qrcodeModal');
        showMessage('支付成功！感谢您的使用！', 'success');
        selectedPlan = null;
    }, 3000);
}

// 检查登录状态
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        updateUIForLoggedInUser();
    }
}

// 更新已登录用户的UI
function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn && registerBtn) {
        loginBtn.textContent = currentUser;
        loginBtn.onclick = logout;
        registerBtn.style.display = 'none';
    }
}

// 登出
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// 显示消息
function showMessage(message, type = 'info') {
    // 移除现有消息
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // 插入到页面顶部
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// 保存用户数据到本地文件（用于演示）
function saveUserDataToFile(data, type) {
    // 获取现有数据
    const allData = JSON.parse(localStorage.getItem('allUserData') || '[]');
    
    // 添加新数据
    allData.push({
        type: type,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    // 保存到localStorage
    localStorage.setItem('allUserData', JSON.stringify(allData));
    
    // 创建可下载的文件内容
    updateDataFile();
}

// 更新数据文件
function updateDataFile() {
    const allData = JSON.parse(localStorage.getItem('allUserData') || '[]');
    
    let fileContent = '共享单车网站用户数据收集\n';
    fileContent += '=================================\n';
    fileContent += '生成时间: ' + new Date().toLocaleString('zh-CN') + '\n\n';
    
    allData.forEach((entry, index) => {
        fileContent += `记录 ${index + 1}:\n`;
        fileContent += `类型: ${entry.type}\n`;
        fileContent += `时间: ${new Date(entry.timestamp).toLocaleString('zh-CN')}\n`;
        
        if (entry.type === 'register') {
            fileContent += `用户名: ${entry.data.username}\n`;
            fileContent += `密码: ${entry.data.password}\n`;
            fileContent += `邮箱: ${entry.data.email}\n`;
            fileContent += `手机号: ${entry.data.phone}\n`;
        } else if (entry.type === 'login') {
            fileContent += `登录用户: ${entry.data.username}\n`;
            fileContent += `登录密码: ${entry.data.password}\n`;
        } else if (entry.type === 'payment') {
            fileContent += `付款用户: ${entry.data.username}\n`;
            fileContent += `付款金额: ¥${entry.data.amount}\n`;
            fileContent += `购买方案: ${entry.data.planType}\n`;
            fileContent += `单车编号: ${entry.data.bikeId}\n`;
        }
        
        fileContent += '-------------------\n\n';
    });
    
    // 保存到localStorage以供下载
    localStorage.setItem('userDataFile', fileContent);
}

// 下载数据文件
function downloadUserData() {
    const fileContent = localStorage.getItem('userDataFile') || '暂无数据';
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '用户数据_' + new Date().toISOString().slice(0,10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 显示数据统计
function showDataStats() {
    const allData = JSON.parse(localStorage.getItem('allUserData') || '[]');
    const registrations = allData.filter(item => item.type === 'register').length;
    const logins = allData.filter(item => item.type === 'login').length;
    const payments = allData.filter(item => item.type === 'payment').length;
    
    alert(`数据统计:\n注册用户: ${registrations}\n登录次数: ${logins}\n支付次数: ${payments}\n\n点击确定后可下载详细数据文件`);
    downloadUserData();
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 键盘事件处理
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});
