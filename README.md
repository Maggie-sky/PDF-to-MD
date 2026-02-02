# PDF/Word 转 Markdown 智能转换工具

这是一个基于 Google Gemini 3.0 Flash 视觉模型开发的纯前端文档转换工具。

## 功能特点
- **多格式支持**：支持 PDF (.pdf) 和 Word (.docx, .doc) 文件转换。
- **高保真还原**：利用 AI 深度理解文档结构，保留标题、列表、加粗、超链接等。
- **纯前端架构**：基于 React 19 和 ESM，无需复杂的本地构建步骤。
- **响应式设计**：适配 PC 和移动端，支持拖拽上传。

## 部署步骤

### 1. 准备 API Key
1. 前往 [Google AI Studio](https://aistudio.google.com/) 获取 API Key。

### 2. 环境变量配置
在你的部署平台（如 Vercel, Netlify）的环境变量设置中添加：
- `API_KEY`: 填写你获取的 Gemini API 密钥。

### 3. 静态部署
本应用为单页应用 (SPA)，只需托管 `index.html` 及其关联的 `.tsx` 文件即可。

#### 使用 Vercel 快速部署：
1. 推送代码至 GitHub。
2. 在 Vercel 中导入仓库。
3. 配置环境变量 `API_KEY`。
4. 部署成功。

## 技术栈
- **框架**: React 19
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **AI 模型**: Google Gemini 3.0 Flash
- **模块加载**: ESM.sh (无需 npm install)

## 许可
MIT License
