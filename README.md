# Cordova cloud pack

- 远程打包

- 首先要开启mongo服务器


## 系统要求

os  |	command
----|----
OS X|	xcode-select --install;brew install pkg-config cairo libpng jpeg giflib
Ubuntu|	sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

## install

```
cd pack2
npm install

cd yigomobile/public
npm install

```

## 数据库备份和恢复

备份
```

mongodump -h 127.0.0.1  -d koa-app -o ~/Desktop/
```
恢复
```
mongorestore -h 127.0.0.1 -d koa-app -directoryperdb ~/project/data/db/koa-app
```