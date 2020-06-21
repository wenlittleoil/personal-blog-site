import axios from 'axios';
import { message } from 'antd';

const request = async config => {
  const {
    method,
    url,
    params = {},
    data = {},
    autoErrTip = true,
  } = config;
  try {
    const result = await axios({
      method,
      url,
      params,
      data: data,
      withCredentials: true,
      responseType: 'json',
    });
    return result.data;
  } catch (error) {
    if (autoErrTip) {
      message.error(error.message);
    }
    return Promise.reject(error);
  }

}

request.get = config => {
  return request({
    method: 'get',
    ...config,
  });
}
request.post = config => {
  return request({
    method: 'post',
    ...config,
  });
}

export default request;
