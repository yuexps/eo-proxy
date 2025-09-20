/**
 * EdgeOne Pages 通用下载反向代理
 */
export async function onRequest(context) {
  const { request, env } = context;

  try {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

  const requestUrl = new URL(request.url);
  const targetUrlParam = requestUrl.searchParams.get('url');

    // 如果没有url参数，显示使用说明
    if (!targetUrlParam) {
      return new Response(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在线工具 - 文件下载测试</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card-bg {
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  </style>
</head>
<body>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 gradient-bg">
    <div class="w-full max-w-lg">
      <div class="rounded-xl shadow-2xl card-bg">
        <div class="p-8">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-white">文件下载测试</h1>
            <p class="text-gray-200 mt-2">简单、快速、可靠的文件下载测试工具</p>
          </div>
          
          <form id="urlForm" onsubmit="handleSubmit(event)">
            
            <div class="relative mb-4">
              <input type="text" id="targetUrl" required
                class="w-full px-4 py-3 text-lg text-white bg-white/10 rounded-lg border border-transparent focus:border-white/50 focus:ring-0 focus:outline-none transition duration-300"
                placeholder="下载链接" autocomplete="url">
            </div>

            <div class="relative mb-4">
              <input type="password" id="accessToken"
                class="w-full px-4 py-3 text-lg text-white bg-white/10 rounded-lg border border-transparent focus:border-white/50 focus:ring-0 focus:outline-none transition duration-300"
                placeholder="访问令牌（可选）" autocomplete="off">
            </div>
            
            <div class="flex gap-2 mb-4">
              <button type="submit"
                class="flex-1 px-4 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300">
                开始下载
              </button>
              <button type="button" onclick="copyProxyLink()"
                class="px-4 py-3 text-lg font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300">
                复制链接
              </button>
            </div>
            
            <div class="text-center">
              <label class="flex items-center justify-center text-sm text-white/80">
                <input type="checkbox" id="openNewTab" checked class="mr-2 rounded">
                在新标签页下载
              </label>
            </div>
          </form>
          
          <!-- 使用说明 -->
          <div class="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 class="text-sm font-medium text-white mb-2">使用说明</h3>
            <div class="text-xs text-white/70 space-y-1">
              <p>• 输入完整链接，如：https://xxx.xx/xxx.zip</p>
              <p>• 支持HTTP和HTTPS协议</p>
              <p>• 仅供学习和个人使用,禁止滥用！</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer class="text-center mt-6">
        <p class="text-sm text-white/70">由 EdgeOne Pages 强力驱动</p>
      </footer>
    </div>
  </div>

  <script>
    function handleSubmit(event) {
      event.preventDefault();
      const targetUrl = document.getElementById('targetUrl').value.trim();
      const accessToken = document.getElementById('accessToken').value.trim();
      
      if (!targetUrl) {
        alert('请输入目标网址');
        return;
      }

      // 自动添加协议
      const finalUrl = targetUrl.startsWith('http') ? targetUrl : 'https://' + targetUrl;
      
      // 简单URL验证
      try {
        new URL(finalUrl);
      } catch (e) {
        alert('请输入有效的网址');
        return;
      }

      // 构建代理URL，包含token（如果提供了）
      let proxyUrl = buildProxyUrl(finalUrl, accessToken);
      
      const openNewTab = document.getElementById('openNewTab').checked;
      
      if (openNewTab) {
        window.open(proxyUrl, '_blank');
      } else {
        window.location.href = proxyUrl;
      }
    }

    function buildProxyUrl(targetUrl, accessToken) {
      let proxyUrl = window.location.origin + '/?';
      if (accessToken) {
        proxyUrl += 'token=' + encodeURIComponent(accessToken) + '&';
      }
      proxyUrl += 'url=' + encodeURIComponent(targetUrl);
      return proxyUrl;
    }

    function copyProxyLink() {
      const targetUrl = document.getElementById('targetUrl').value.trim();
      const accessToken = document.getElementById('accessToken').value.trim();
      
      if (!targetUrl) {
        alert('请先输入目标网址');
        return;
      }

      // 自动添加协议
      const finalUrl = targetUrl.startsWith('http') ? targetUrl : 'https://' + targetUrl;
      
      // 简单URL验证
      try {
        new URL(finalUrl);
      } catch (e) {
        alert('请输入有效的网址');
        return;
      }

      const proxyUrl = buildProxyUrl(finalUrl, accessToken);
      
      // 复制到剪贴板
      navigator.clipboard.writeText(proxyUrl).then(() => {
        // 显示成功提示
        showToast('链接已复制到剪贴板！');
      }).catch(err => {
        // 降级方案：手动选择复制
        const textArea = document.createElement('textarea');
        textArea.value = proxyUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('链接已复制到剪贴板！');
      });
    }

    function showToast(message) {
      // 创建提示元素
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
      document.body.appendChild(toast);
      
      // 3秒后移除提示
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  </script>
</body>
</html>`, {
                status: 200,
                headers: { 
                    'Content-Type': 'text/html; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

    // Token鉴权检查
    const authResult = authenticateRequest(request, requestUrl, env);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        error: authResult.message,
        code: authResult.code,
        timestamp: new Date().toISOString()
      }), {
        status: authResult.status || 401,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // URL验证和安全检查
    let targetUrl;
    try {
      targetUrl = new URL(targetUrlParam);
    } catch (e) {
      return new Response(JSON.stringify({
        error: '无效的URL格式',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 内网检测
    const hostname = targetUrl.hostname;
    const blockedPatterns = [
      'localhost', '127.0.0.1', '0.0.0.0', '::1',
      '10.', '172.16.', '172.17.', '172.18.', '172.19.',
      '172.20.', '172.21.', '172.22.', '172.23.', '172.24.',
      '172.25.', '172.26.', '172.27.', '172.28.', '172.29.',
      '172.30.', '172.31.', '192.168.'
    ];

    if (blockedPatterns.some(pattern => hostname.includes(pattern))) {
      return new Response(JSON.stringify({
        error: '禁止访问内网地址',
        timestamp: new Date().toISOString()
      }), {
        status: 403,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 检查客户端是否请求Range分片
    const rangeHeader = request.headers.get('Range');
    const isRangeRequest = !!rangeHeader;
    
    // 如果是Range请求，先检查文件大小决定是否启用分片回源
    let shouldUseRange = false;
    if (isRangeRequest) {
      try {
        // 发送HEAD请求检查文件大小
        const headResponse = await fetch(targetUrlParam, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'EdgeOne-Proxy/2.0'
          }
        });
        
        const contentLength = parseInt(headResponse.headers.get('Content-Length') || '0');
        const acceptsRanges = headResponse.headers.get('Accept-Ranges');
        
        // 只对大文件(>10MB)且服务器支持Range的情况启用分片回源
        const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB
        shouldUseRange = contentLength > LARGE_FILE_THRESHOLD && 
                        acceptsRanges && 
                        acceptsRanges.toLowerCase() !== 'none';
        
        console.log(`File size: ${contentLength} bytes, Accept-Ranges: ${acceptsRanges}, Use Range: ${shouldUseRange}`);
      } catch (error) {
        console.warn('Failed to check file size, falling back to full download:', error);
        shouldUseRange = false;
      }
    }

    // 构建请求头，保留重要的客户端头部
    const requestHeaders = new Headers({
      'Origin': requestUrl.origin,
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'EdgeOne-Proxy/2.0'
    });

    // 如果启用Range分片，传递相关头部
    if (shouldUseRange && rangeHeader) {
      requestHeaders.set('Range', rangeHeader);
      // 传递其他Range相关头部
      const ifRange = request.headers.get('If-Range');
      if (ifRange) {
        requestHeaders.set('If-Range', ifRange);
      }
    }
    // 传递其他重要的请求头
    const importantHeaders = ['Accept', 'Cache-Control', 'If-Modified-Since', 'If-None-Match'];
    importantHeaders.forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        requestHeaders.set(headerName, value);
      }
    });

    // 使用目标URL，支持大文件流式传输和Range分片
    const modifiedRequest = new Request(targetUrlParam, {
      headers: requestHeaders,
      method: request.method,
      body: (request.method === 'POST' || request.method === 'PUT') ? request.body : null,
      redirect: 'follow'
    });

    const response = await fetch(modifiedRequest);

    // 统一处理所有类型的响应
    const finalHeaders = new Headers(response.headers);
    finalHeaders.delete('Set-Cookie');
    finalHeaders.delete('Content-Security-Policy');
    finalHeaders.delete('X-Frame-Options');
    finalHeaders.delete('Content-Encoding');

    // 添加CORS支持
    finalHeaders.set('Access-Control-Allow-Origin', '*');

    // 对于Range分片响应，保留重要的分片相关头部
    if (shouldUseRange && response.status === 206) {
      // 保留Range分片相关的重要响应头
      const rangeHeaders = ['Content-Range', 'Accept-Ranges', 'Content-Length'];
      rangeHeaders.forEach(headerName => {
        const value = response.headers.get(headerName);
        if (value) {
          finalHeaders.set(headerName, value);
        }
      });
      // 对于分片响应，不设置no-cache，允许浏览器缓存分片
      finalHeaders.set('Cache-Control', 'public, max-age=3600');
      console.log('Range response (206) - preserving cache headers for better performance');
    } else {
      // 对于完整文件下载，禁用缓存确保获取最新版本
      finalHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      finalHeaders.set('Pragma', 'no-cache');
      finalHeaders.set('Expires', '0');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: finalHeaders
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({
      error: '代理请求失败',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

/**
 * Token鉴权函数
 */
function authenticateRequest(request, requestUrl, env) {
    const envTokens = env?.PROXY_ACCESS_TOKEN;
    if (!envTokens) {
        return { success: true };
    }
    
    const validTokens = envTokens.split(',').map(token => token.trim()).filter(Boolean);
    if (validTokens.length === 0) {
        return { success: true };
    }
    
    let token = requestUrl.searchParams.get('token');
    
    if (!token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            } else {
                token = authHeader;
            }
        }
    }
    
    if (!token) {
        return { 
            success: false,
            code: 'TOKEN_MISSING',
            status: 401,
            message: '访问被拒绝：缺少访问令牌'
        };
    }
    
    if (!validTokens.includes(token)) {
        return { 
            success: false,
            code: 'TOKEN_INVALID',
            status: 403,
            message: '访问令牌无效或已过期'
        };
    }
    
    return { success: true };
}