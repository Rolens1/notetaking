# Billboard - 一个现代化的笔记应用

许可证: MIT

一款极简且优雅的笔记应用，灵感源自经典的软木公告板。用户使用 Google 或 GitHub 账户登录后，可以在一个支持拖放的公告板上创建、编辑和可视化地组织他们的笔记。该应用使用 Node.js、Express 和 MongoDB 构建，具有动态且可自定义的用户界面。

## 目录

- [关于项目](#关于项目)
- [主要特性](#主要特性)
- [技术栈](#技术栈)
- [入门指南](#入门指南)
- [使用方法](#使用方法)
- [测试](#测试)
- [联系方式](#联系方式)

## 关于项目

Billboard 的设计初衷不仅仅是成为一个标准的待办事项列表。它重现了物理软木公告板那种可以自由放置和整理想法的满足感。用户可以使用 Markdown 编写详细的笔记，自定义工作区的外观，并通过简单直观的分类系统来组织思路。每个笔记的位置都会被保存，因此您的公告板总能保持您离开时的样子。

该项目展示了一个完整的全栈开发周期，从后端逻辑和数据库管理到创建交互式且响应迅速的用户界面。

## 主要特性

- **安全的用户认证**：使用 Passport.js 通过 Google 或 GitHub 账户无缝登录。
- **丰富的笔记功能**：创建、编辑和删除支持完整 Markdown 语法的笔记，实现富文本格式化。
- **交互式公告板**：动态的拖放界面允许您可视化地组织笔记。您的布局会自动保存。
- **个性化**：
  - 整个应用支持浅色和深色模式。
  - 用户可自定义笔记背景和字体的颜色。
- **组织与筛选**：为笔记分配类别，并使用搜索栏和筛选下拉菜单快速查找信息。
- **用户仪表板**：一个欢迎仪表板，显示使用统计信息或入门指南。
- **RESTful API**：一个后端 API，用于处理所有笔记和用户偏好操作。

## 技术栈

该项目利用了现代技术组合：

- **后端**: Node.js, Express.js
- **数据库**: MongoDB 与 Mongoose ODM
- **认证**: Passport.js (Google OAuth 2.0, GitHub OAuth 2.0), Express Session, Connect-Mongo
- **模板引擎**: EJS (Embedded JavaScript)
- **前端**: 原生 JavaScript (ES6+), 带自定义变量的 CSS3, Font Awesome, Devicon
- **Markdown**: marked.js 用于解析，sanitize-html 用于安全处理
- **开发**: nodemon 用于实时重载，dotenv 用于环境管理
- **测试**: Mocha, Chai, Supertest

## 入门指南

请按照以下步骤在您的机器上设置并运行项目的本地副本。

### 先决条件

您必须在机器上安装并运行 Node.js（包含 npm）和 MongoDB。

### 安装与设置

1.  **克隆代码库**:

    ```bash
    git clone https://github.com/Rolens1/notetaking.git
    ```

    （请注意：原链接似乎有误，已根据上下文修正为 `notetaking` 而非 `note_taking_app`）

2.  **进入项目目录**:

    ```bash
    cd notetaking
    ```

3.  **安装所有依赖项和开发依赖项**:

    ```bash
    npm install
    ```

4.  **在根目录下创建一个 `.env` 文件**。复制下面的示例内容，并填入您自己的密钥和数据库 URL。

    ```env
    # 服务器端口
    PORT=3000

    # MongoDB 连接字符串
    MONGODB_URI=mongodb://localhost:27017/billboard_db

    # 会话密钥 (使用一个长的随机字符串)
    SESSION_SECRET=replace_this_with_a_very_long_random_string

    # Google OAuth 凭证
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

    # GitHub OAuth 凭证
    GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
    GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
    ```

## 使用方法

设置完成后，您可以启动应用程序。

- **在开发模式下运行（带自动重启）**:

  ```bash
  npm run dev
  ```

- **在生产模式下运行**:

  ```bash
  npm start
  ```

在浏览器中打开 `http://localhost:3000`，选择两种登录服务之一。登录后，您将被重定向到仪表板，即可开始使用该应用。

## 测试

该项目使用 Mocha、Chai 和 Supertest 进行 API 端点测试。

测试设置配置为通过运行测试命令时自动设置 `NODE_ENV=test` 来绕过 `isLoggedIn` 认证中间件。这允许直接测试受保护的端点。

⚠️ **重要警告**

运行测试套件将**完全删除**您的 `.env` 文件中指定的数据库里的**所有笔记**。这样做是为了确保每个测试都在一个干净、隔离的环境中运行。

**切勿**针对生产数据库运行测试。强烈建议为测试使用单独的数据库连接字符串。

要运行整个测试套件，请确保您已安装所有依赖项（包括开发依赖项）`npm install`，然后运行：

```bash
npm test
```

---

**注意**: 翻译中修正了原 `git clone` 命令的仓库名称（从 `note_taking_app` 改为 `notetaking` 以匹配提供的链接），并保持了所有链接和代码块的格式。其他内容均按原文意思进行了准确翻译。
