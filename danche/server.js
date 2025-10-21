const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// 存储用户数据（实际项目中应该使用数据库）
let users = [];

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 注册接口
app.post('/api/register', (req, res) => {
    const { username, password, email, phone } = req.body;
    
    console.log('收到注册信息:');
    console.log('用户名:', username);
    console.log('密码:', password);
    console.log('邮箱:', email);
    console.log('手机号:', phone);
    console.log('注册时间:', new Date().toLocaleString('zh-CN'));
    console.log('----------------------------');
    
    // 保存用户信息
    users.push({
        username,
        password,
        email,
        phone,
        registerTime: new Date()
    });
    
    res.json({
        success: true,
        message: '注册成功！',
        data: {
            username: username
        }
    });
});

// 登录接口
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('收到登录信息:');
    console.log('用户名:', username);
    console.log('密码:', password);
    console.log('登录时间:', new Date().toLocaleString('zh-CN'));
    console.log('----------------------------');
    
    // 简单验证（实际项目中应该进行加密验证）
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({
            success: true,
            message: '登录成功！',
            data: {
                username: username
            }
        });
    } else {
        res.json({
            success: false,
            message: '用户名或密码错误！'
        });
    }
});

// 支付接口
app.post('/api/payment', (req, res) => {
    const { amount, bikeId } = req.body;
    
    console.log('收到支付请求:');
    console.log('金额:', amount);
    console.log('单车ID:', bikeId);
    console.log('支付时间:', new Date().toLocaleString('zh-CN'));
    console.log('----------------------------');
    
    // 返回微信收款码
    res.json({
        success: true,
        message: '请扫描二维码完成支付',
        data: {
            paymentUrl: 'wxp://f2f1IpkcegOSchfTqqtb4PoMRngHHhAuMhiriMM15BCgeHdG7jpu4INFAX6sY5HBD8DA',
            amount: amount,
            bikeId: bikeId
        }
    });
});

// 获取用户列表（调试用）
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        data: users
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('等待接收用户注册和登录信息...');
});
