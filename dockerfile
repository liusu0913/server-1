# 父镜像
FROM zhangyaming0726/node:v2
# 安装服务
ADD server.tar.gz /usr/local/services/server
# 安装启动脚本
COPY ./server.ini  /etc/supervisord.d/
ENTRYPOINT supervisord && /bin/sh -c 'while true; do echo hello docker; sleep 3600; done'
