const apiHost = 'http://localhost:8008';

const apiPath = {
  getBlogListApi: '/api/blog/list',
  getBlogDetailApi: '/api/blog/detail',
  createBlogApi: '/api/blog/create',
  updateBlogApi: '/api/blog/update',
  delBlogApi: '/api/blog/del',

  loginApi: '/api/user/login',
  userInfoApi: '/api/user/info',
}

const api = Object.keys(apiPath).reduce((prev, cur) => {
  prev[cur] = `${apiHost}${apiPath}`;
  return prev;
}, {});

export default api;
