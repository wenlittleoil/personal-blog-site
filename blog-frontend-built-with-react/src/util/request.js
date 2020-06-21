import axios from 'axios';

const request = async config => {
  const {
    method,
    url,
    params = {},
    data = {},
  } = config;
  const result = await axios({
    method,
    url,
    params,
    data: data,
    withCredentials: true,
    responseType: 'json',
  });
  return result;
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
