const {
  getBlogList,
  getBlogDetail,
  createBlog,
  updateBlog,
} = require('../controller/blog');
const {
  login,
  loginTest,
} = require('../controller/user');

const dispatcher = {
  'get /api/blog/list': getBlogList,
  'get /api/blog/detail': getBlogDetail,
  'post /api/blog/create': createBlog,
  'post /api/blog/update': updateBlog,
  
  'post /api/user/login': login,
  'get /api/user/login-test': loginTest,
}

module.exports = dispatcher;
