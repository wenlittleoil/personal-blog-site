const CURRENT_ENV = 'dev';

let gconfig = {};

if (CURRENT_ENV === 'dev') {
  gconfig = {
    apiHost: 'http://localhost:8008', // cross domain XHR request (through CORS Mechanism)
    // apiHost: window.location.origin, // same domain XHR request (through Nginx Proxy)
  }
} else {
  gconfig = {
    // apiHost: 'http://localhost:8008',
    apiHost: window.location.origin,
  }
}

// 发送 get 请求
function get(url) {
  url = `${gconfig.apiHost}${url}`
  return $.get({
      url,
      xhrFields: {
        // bringing cookies back to the server
        withCredentials: true
      }
  })
}

// 发送 post 请求
function post(url, data = {}) {
  url = `${gconfig.apiHost}${url}`
  return $.ajax({
      type: 'post',
      url,

      /**
       * default cross domain xhr doesn't support application/json,
       * but application/x-www-form-urlencoded is ok.
      */
      // data: Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&'),
      // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

      data: JSON.stringify(data),
      contentType: "application/json",
      xhrFields: {
        // bringing cookies back to the server
        withCredentials: true,
      }
  })
}

// 显示格式化的时间
function getFormatDate(dt) {
  if (moment) {
    return moment(dt).format('LL');
  }
  return '';
}

// 获取 url 参数
function getUrlParams() {
  let paramStr = location.href.split('?')[1] || ''
  paramStr = paramStr.split('#')[0]
  const result = {}
  paramStr.split('&').forEach(itemStr => {
      const arr = itemStr.split('=')
      const key = arr[0]
      const val = arr[1]
      result[key] = val
  })
  return result
}

function initLoginCheck() {
  const pathname = location.pathname;
  if (pathname === "/login.html") return;
  get('/api/user/info').then(res => {
    const {
      errno,
      data
    } = res;
    const {
      login_status,
    } = data;
    if (!login_status) {
      location.replace('/login.html');
    }
  })
}

initLoginCheck()
