# 在线阅读系统
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 项目简介

本项目是一个基于 **Python Flask** 的后端和 **uniapp** 的前端开发的在线阅读系统，旨在为用户提供一个功能丰富、体验良好的在线阅读环境。系统包含管理员和普通用户两个角色，分别满足不同的需求。

- **管理员**：可以管理书籍、收费模式、广告、用户信息等，并通过大屏看板查看数据分析。
- **普通用户**：可以浏览书籍列表、阅读书籍、个性化定制阅读界面、查看历史记录等。

本项目采用 **MySQL** 存储关系型数据（如用户信息、书籍元数据）和 **MongoDB** 存储非结构化数据（如书籍内容）。通过 **Docker** 容器化部署，并使用 **Nginx** 作为反向代理，隐藏后端服务，提升安全性与性能。

---

## 功能特性

### 管理员功能

1. **书籍管理**
   - 上传书籍。
   - 支持移动端预览效果。
   - 采用富文本编辑器,提供书籍编辑功能以优化阅读体验。

2. **收费管理**
   - 设置书籍为免费或收费。
   - 支持免费阅读页数设定、收费金额、是否免费等。
   - 集成支付宝沙箱支付功能。

3. **广告管理**
   - 提供“看广告免费阅读”模式。
   - 接入第三方广告 API 或调用视频广告。
4. **用户管理**
   - 查看和管理用户信息。
5. **大屏看板**
   - 数据可视化：展示书籍阅读情况、用户行为分析、收费情况等。
---

### 普通用户功能

1. **书籍列表**
   - 分页显示书籍基本信息（封面、是否收费等）。

2. **阅读书籍**
   - 多端自适应阅读界面。
   - 支持背景色,字体大小,字距等个性化定制。

3. **历史记录**
   - 查看阅读记录、充值记录、支付记录。

---

## 技术栈

- **后端**
  - Python Flask
  - 数据库：
    - MySQL：存储用户信息、书籍元数据、收费记录等关系型数据。
    - MongoDB：存储书籍内容（章节、段落等非结构化数据）。
  - RESTful API 设计
  - 支付集成：支付宝沙箱

- **前端**
  - uniapp（跨平台开发框架）
  - Vue.js
  - HTML5 + CSS3

- **容器化与部署**
  - Docker：用于容器化后端、前端和数据库服务。
  - Nginx：作为反向代理，隐藏后端服务并代理前端请求。

- **其他工具**
  - Git 版本控制
---

## 效果展示

### 管理员后台 - 首页

![](./static/image/img_1.png)  

### 管理员后台 - 主页

![](./static/image/img_2.png)  

### 管理员后台 - 书籍编辑预览

![](./static/image/img_3.png)  

### 管理员后台 - 广告管理

![](./static/image/img_4.png)  

### 管理员后台 - 大屏看板

![](./static/image/img_5.png)  

### 用户端 - 书籍列表界面

![书籍列表](./static/image/img.png)  


### 用户端 - 阅读界面

![阅读界面](./static/image/img_6.png)

### 用户端 - 个性化设置

![阅读界面](./static/image/img_7.png)  

### 用户端 - 书架与阅读记录

![](./static/image/img_8.png)  
### 用户端 - 个人中心

![](./static/image/img_9.png)  


## 项目结构
```bash
online-reading-system/
├── backend-python/
│   ├── app/
│   │   ├── config.py # Flask 配置文件(mongodb,redis,mysql连接配置)
│   │   ├── models/ # 数据库模型
│   │   ├── routes/ # 路由
│   │   ├── services/ # 业务逻辑
│   │   ├── utils/
│   │   │   ├── batchhandelepub.py # epub文件批量处理上传数据库,只接受epub格式文件
│   │   │   ├── payparms.py # 支付宝沙箱支付参数,服务器图片等静态资源SERVERURL配置
├── admin-end/ # 管理员端未打包源码
├── user-end/ # 用户端未打包源码
├── nginx/ # Nginx容器配置,打包两个前端,用户端和管理员端
│   ├── nginx.conf # Nginx 配置文件
│   ├── Dockerfile # Nginx 配置文件
```
## 后端快速开始
1. 克隆项目到本地,并将backend-python单独作为一个项目
2. 配置config.py,将里面的三个数据库连接配置修改为自己的配置
3. 配置payparms.py,将里面的支付宝沙箱支付参数配置修改为自己的配置,以及serverUrl用来提供静态资源路径
## Docker方式打包后端
1. 进入backend-python目录,找到Dockerfile文件,执行docker build -t online-reading-system-backend .
2. docker命令启动:
    ```bash
   docker run  -d ^
   -p 5000:5000 ^
   -e SERVER_URL="http://[your ip]/api" ^ #nginx代理后端,所以添加/api
   -e MONGO_URL="mongodb://host.docker.internal:27017/reading" ^
   -e SQLALCHEMY_DATABASE_URI="mysql+pymysql://root:123456@host.docker.internal:3306/reading" ^
   -e REDIS_URL="redis://host.docker.internal:6379/0" ^
   -e REDIS_ENABLED="true" ^
   -e SENSITIVE_ENABLED="false" ^
   --name flask_container ^
   --network onlinereading ^  # docker网络
    readingserver
    ```
## 联系我们

如果您在使用本项目时遇到任何问题，或者有任何建议和反馈，请通过以下方式联系我们：

- **邮箱**: [3092176591@qq.com](mailto:3092176591@qq.com)
- **GitHub Issues**: 欢迎在项目 Issues 页面
