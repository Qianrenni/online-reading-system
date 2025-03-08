FROM nginx:alpine

# 删除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义的 Nginx 配置文件
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 复制普通用户前端的静态文件
COPY ../user-end /usr/share/nginx/html/user

# 复制管理员前端的静态文件
COPY ../admin-end /usr/share/nginx/html/admin

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]