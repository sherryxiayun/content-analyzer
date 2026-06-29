# 📌 内容选题智能拆解分析平台

一个专业的内容分析工具，输入链接或文本后，自动拆解内容结构、主题、角色、场景等关键要素。

## ✨ 核心功能

- 🔗 **支持通用网页链接** - 自动提取内容
- 🤖 **AI 智能分析** - 自动拆解内容结构
- 📌 **主题提取** - 识别核心话题
- 🏗️ **结构分析** - 逻辑框架拆解
- 👥 **角色识别** - 人物设定识别
- 🎬 **场景提取** - 背景设置分析
- 📥 **导出功能** - 支持 JSON/Markdown 导出

## 🛠️ 技术栈

- **前端**: React 18 + Axios + CSS3
- **后端**: Node.js + Express + Cheerio (网页爬虫)
- **AI**: 本地 AI 分析引擎（无需付费 Key）
- **运行环境**: Node.js 16+

## 🚀 快速开始

### 前置条件
- Node.js 16+ 已安装
- npm 8+

### 本地开发安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/sherryxiayun/content-analyzer.git
cd content-analyzer

# 2. 安装依赖
npm install

# 3. 启动项目（同时启动前后端）
npm run dev

# 前端: http://localhost:3000
# 后端: http://localhost:5000
```

### 单独启动

```bash
# 只启动后端
npm run dev:backend

# 只启动前端
npm run dev:frontend
```

## 📖 使用指南

### 1. 打开应用
访问 `http://localhost:3000`

### 2. 输入内容
- **方式1**: 粘贴链接（自动提取网页内容）
- **方式2**: 直接粘贴文本内容

### 3. 点击分析
系统将自动拆解并显示：
- 📌 核心主题
- 🏗️ 内容结构（开头、中间、结尾）
- 👥 主要角色
- 🎬 场景设置
- 💡 关键洞察

### 4. 导出结果
支持导出为 JSON 或 Markdown 格式

## 📁 项目结构

```
content-analyzer/
├── frontend/                    # React 前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LinkInput.jsx           # 输入框组件
│   │   │   ├── AnalysisResult.jsx      # 结果展示组件
│   │   │   └── *.css                   # 组件样式
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
│
├── backend/                     # Node.js + Express 后端
│   ├── routes/
│   │   └── analyze.js                  # 分析路由
│   ├── controllers/
│   │   └── analysisController.js       # 业务逻辑控制器
│   ├── services/
│   │   ├── aiService.js                # AI 分析服务
│   │   ├── webService.js               # 网页爬虫服务
│   │   └── parsingService.js           # 内容解析服务
│   ├── middleware/
│   │   └── errorHandler.js             # 错误处理中间件
│   ├── server.js                       # 主服务器文件
│   ├── package.json
│   └── .env.example
│
├── package.json                 # 根配置（Monorepo）
└── .gitignore
```

## 🔧 配置说明

### 后端环境变量 (backend/.env)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
REQUEST_TIMEOUT=10000
MAX_CONTENT_LENGTH=5242880
```

## 📊 API 文档

### 分析端点

**POST** `/api/analyze`

请求体：
```json
{
  "content": "文本内容或网页链接",
  "type": "text" // 或 "url"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "analysis": {
      "topic": { "main": "核心主题", "keywords": [...] },
      "structure": { "opening": {...}, "middle": {...}, "closing": {...} },
      "characters": [{"name": "角色", "role": "定位", ...}],
      "scenes": [{"name": "场景", "description": "描述", ...}],
      "insights": ["洞察1", "洞察2", ...],
      "metadata": {...}
    }
  }
}
```

## 🐛 常见问题

### Q: 为什么提示网络错误？
A: 检查后端是否正在运行（`npm run dev:backend`）

### Q: 如何离线使用？
A: 分析引擎在本地运行，但需要网络来提取网页内容

### Q: 支持哪些链接类型？
A: 任何公开网页链接都支持（抖音、小红书、YouTube、博客等）

## 📝 开发指南

### 添加新的分析维度
编辑 `backend/services/aiService.js`，在分析模板中添加新字段。

### 修改前端样式
编辑 `frontend/src/App.css` 或在组件中修改样式。

### 集成真实 AI API
1. 获取 API Key（如 OpenAI、Anthropic 等）
2. 编辑 `backend/services/aiService.js`
3. 替换 `analyzeContent()` 方法

## 📦 部署

### Docker 部署（可选）

```bash
docker-compose up -d
```

### 云服务部署
- **前端**: Vercel / Netlify
- **后端**: Railway / Heroku / Render

## 📄 许可证

MIT

## 👨‍💻 贡献

欢迎提交 Issues 和 Pull Requests！

---

**需要帮助？** 查看 [快速开始](#-快速开始) 部分或提交 Issue。
