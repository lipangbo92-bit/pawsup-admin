// Vercel API Route: /api/services
// 直接使用云开发 Node.js SDK 访问数据库

const cloudbase = require('@cloudbase/node-sdk');

// 初始化云开发
const app = cloudbase.init({
  env: 'cloud1-4gy1jyan842d73ab',
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY
});

const db = app.database();

// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

module.exports = async (req, res) => {
  // 处理 CORS 预检
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { action = 'list', data, id } = req.body || {};
  
  console.log(`[API Services] Action: ${action}`);

  try {
    let result;
    
    switch (action) {
      case 'list':
        result = await getServicesList();
        break;
      case 'add':
        result = await addService(data);
        break;
      case 'update':
        result = await updateService(id, data);
        break;
      case 'delete':
        result = await deleteService(id);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }

    return res.json(result);
  } catch (error) {
    console.error('[API Services] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 获取服务列表
async function getServicesList() {
  const result = await db.collection('services').get();
  return {
    success: true,
    data: result.data
  };
}

// 添加服务
async function addService(data) {
  const result = await db.collection('services').add({
    ...data,
    createTime: new Date()
  });
  return {
    success: true,
    id: result.id
  };
}

// 更新服务
async function updateService(id, data) {
  await db.collection('services').doc(id).update({
    ...data,
    updateTime: new Date()
  });
  return {
    success: true
  };
}

// 删除服务
async function deleteService(id) {
  await db.collection('services').doc(id).remove();
  return {
    success: true
  };
}
