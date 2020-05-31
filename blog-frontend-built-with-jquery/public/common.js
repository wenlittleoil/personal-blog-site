const CURRENT_ENV = 'dev';

let gconfig = {};

if (CURRENT_ENV === 'dev') {
  gconfig = {
    apiHost: 'http://localhost:8000',
  }
} else {
  gconfig = {
    apiHost: 'http://localhost:8000',
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
