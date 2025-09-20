# EdgeOne Pages 通用下载反向代理

基于腾讯云 EdgeOne Pages 的简单反向代理服务。

## 特性

- 简单易用，开箱即用
- 支持Token鉴权，防止滥用
- 基于无服务器架构

## 快速部署

1. **Fork 项目**到你的 GitHub 账户
2. **在 EdgeOne Pages 部署**
   - 访问 [腾讯云 EdgeOne 控制台](https://console.tencentcloud.com/edgeone/pages)
   - 创建项目，导入 Git 仓库
   - 环境变量（可选）：`PROXY_ACCESS_TOKEN=你的令牌`
3. **开始部署**

## 使用方法

### 网页界面
访问部署域名，输入目标网址即可

### API 调用
```bash
# 基本用法
https://你的域名/?url=目标网址

# 带令牌
https://你的域名/?token=你的令牌&url=目标网址
```

## 免责声明

本项目仅供学习和个人使用，请遵守相关法律法规，不得用于非法用途。

## 许可证

[MIT License](./LICENSE)

## 致谢

本项目基于 [EdgeOne-Proxy](https://github.com/6Kmfi6HP/edgeone-proxy) 的优秀设计。
