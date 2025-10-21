// 全局变量
let currentPlan = null;
let currentPrice = 0;

// 模态框操作
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // 清除消息
    const messageElement = document.getElementById(modalId.replace('Modal', 'Message'));
    if (messageElement) {
        messageElement.innerHTML = '';
    }
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    openModal(toModal);
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

// 显示消息
function showMessage(elementId, message, type = 'success') {
    const messageElement = document.getElementById(elementId);
    messageElement.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // 3秒后自动清除消息
    setTimeout(() => {
        messageElement.innerHTML = '';
    }, 3000);
}

// 生成随机订单号
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `QC${year}${month}${day}${random}`;
}

// 模拟发送注册数据到服务器
function sendToServer(data, endpoint) {
    console.log(`发送数据到 ${endpoint}:`, data);
    
    // 模拟服务器响应
    return new Promise((resolve) => {
        setTimeout(() => {
            // 保存到本地存储（模拟服务器存储）
            if (endpoint === 'register') {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                users.push({
                    id: Date.now(),
                    phone: data.phone,
                    username: data.username,
                    password: data.password,
                    registerTime: new Date().toISOString()
                });
                localStorage.setItem('users', JSON.stringify(users));
                
                // 记录注册日志
                const logs = JSON.parse(localStorage.getItem('userLogs') || '[]');
                logs.push({
                    type: 'register',
                    data: data,
                    timestamp: new Date().toISOString(),
                    ip: '127.0.0.1' // 模拟IP
                });
                localStorage.setItem('userLogs', JSON.stringify(logs));
            }
            
            resolve({ success: true, message: '操作成功' });
        }, 1000); // 模拟网络延迟
    });
}

// 注册表单处理
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('registerPhone').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // 基本验证
    if (password !== confirmPassword) {
        showMessage('registerMessage', '两次输入的密码不一致', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('registerMessage', '密码长度至少6位', 'error');
        return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        showMessage('registerMessage', '请输入正确的手机号', 'error');
        return;
    }
    
    // 检查用户是否已存在
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.phone === phone)) {
        showMessage('registerMessage', '该手机号已被注册', 'error');
        return;
    }
    
    if (users.some(user => user.username === username)) {
        showMessage('registerMessage', '用户名已被使用', 'error');
        return;
    }
    
    showMessage('registerMessage', '正在注册中...', 'success');
    
    // 发送注册数据
    const registerData = {
        phone: phone,
        username: username,
        password: password
    };
    
    try {
        const response = await sendToServer(registerData, 'register');
        if (response.success) {
            showMessage('registerMessage', '注册成功！正在跳转登录...', 'success');
            
            // 2秒后切换到登录
            setTimeout(() => {
                switchModal('registerModal', 'loginModal');
                showMessage('loginMessage', '注册成功，请登录', 'success');
            }, 2000);
        }
    } catch (error) {
        showMessage('registerMessage', '注册失败，请稍后重试', 'error');
    }
});

// 登录表单处理
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    showMessage('loginMessage', '正在登录中...', 'success');
    
    // 验证用户
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.username === username || u.phone === username) && u.password === password);
    
    setTimeout(() => {
        if (user) {
            // 保存登录状态
            localStorage.setItem('currentUser', JSON.stringify(user));
            showMessage('loginMessage', '登录成功！', 'success');
            
            // 更新导航栏
            updateNavbar(user);
            
            setTimeout(() => {
                closeModal('loginModal');
            }, 1500);
        } else {
            showMessage('loginMessage', '用户名或密码错误', 'error');
        }
    }, 1000);
});

// 更新导航栏显示
function updateNavbar(user) {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = `
        <a href="#" class="nav-link">首页</a>
        <a href="#services" class="nav-link">服务</a>
        <a href="#pricing" class="nav-link">价格</a>
        <span class="nav-link">欢迎，${user.username}</span>
        <button class="login-btn" onclick="logout()">退出</button>
    `;
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// 选择套餐
function selectPlan(planType, price) {
    // 检查是否已登录
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        openModal('loginModal');
        showMessage('loginMessage', '请先登录后再购买套餐', 'error');
        return;
    }
    
    currentPlan = planType;
    currentPrice = price;
    
    let planName = '';
    switch(planType) {
        case 'single':
            planName = '按次计费';
            break;
        case 'monthly':
            planName = '月卡套餐';
            break;
        case 'yearly':
            planName = '年卡套餐';
            break;
    }
    
    // 更新支付模态框内容
    document.getElementById('planName').textContent = planName;
    document.getElementById('planPrice').textContent = `¥${price}`;
    document.getElementById('paymentAmount').textContent = `¥${price}`;
    document.getElementById('orderId').textContent = generateOrderId();
    
    openModal('paymentModal');
}

// 打开微信支付
function openWechatPay() {
    const wechatUrl = "wxp://f2f1IpkcegOSchfTqqtb4PoMRngHHhAuMhiriMM15BCgeHdG7jpu4INFAX6sY5HBD8DA";
    
    // 记录支付日志
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const paymentLog = {
        type: 'payment',
        user: currentUser,
        plan: currentPlan,
        amount: currentPrice,
        orderId: document.getElementById('orderId').textContent,
        timestamp: new Date().toISOString(),
        wechatUrl: wechatUrl
    };
    
    const logs = JSON.parse(localStorage.getItem('paymentLogs') || '[]');
    logs.push(paymentLog);
    localStorage.setItem('paymentLogs', JSON.stringify(logs));
    
    console.log('支付信息记录:', paymentLog);
    
    // 尝试打开微信
    try {
        window.location.href = wechatUrl;
    } catch (error) {
        // 如果无法直接跳转，显示提示
        alert('请复制以下链接到微信打开：\n' + wechatUrl);
        
        // 尝试复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(wechatUrl).then(() => {
                alert('链接已复制到剪贴板，请到微信粘贴打开');
            });
        }
    }
    
    // 模拟支付完成（实际情况下应该是微信回调）
    setTimeout(() => {
        if (confirm('支付是否已完成？')) {
            alert('支付成功！您的套餐已激活。');
            closeModal('paymentModal');
            
            // 记录支付成功
            const successLog = {
                ...paymentLog,
                status: 'success',
                completedTime: new Date().toISOString()
            };
            
            const successLogs = JSON.parse(localStorage.getItem('paymentSuccessLogs') || '[]');
            successLogs.push(successLog);
            localStorage.setItem('paymentSuccessLogs', JSON.stringify(successLog));
        }
    }, 3000);
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        updateNavbar(currentUser);
    }
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 调试功能：显示所有存储的数据
function showAllData() {
    console.log('用户数据:', JSON.parse(localStorage.getItem('users') || '[]'));
    console.log('注册日志:', JSON.parse(localStorage.getItem('userLogs') || '[]'));
    console.log('支付日志:', JSON.parse(localStorage.getItem('paymentLogs') || '[]'));
    console.log('支付成功日志:', JSON.parse(localStorage.getItem('paymentSuccessLogs') || '[]'));
    console.log('当前用户:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
}

// 调试功能：清除所有数据
function clearAllData() {
    localStorage.clear();
    console.log('所有数据已清除');
    location.reload();
}

// 在控制台输出调试提示
console.log('调试功能:');
console.log('showAllData() - 显示所有存储的数据');
console.log('clearAllData() - 清除所有数据');
