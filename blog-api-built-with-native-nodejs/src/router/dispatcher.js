const {
  getBlogList,
  getBlogDetail,
  createBlog,
  updateBlog,
  delBlog,
} = require('../controller/blog');
const {
  login,
  getUserInfo,
} = require('../controller/user');

const dispatcher = {
  'get /api/blog/list': {
    handle: getBlogList,
  },
  'get /api/blog/detail': {
    handle: getBlogDetail,
  },
  'post /api/blog/create': {
    auth: true,
    handle: createBlog,
  },
  'post /api/blog/update': {
    auth: true,
    handle: updateBlog,
  },
  
  'post /api/user/login': {
    handle: login,
  },
  'get /api/user/info': {
    handle: getUserInfo,
  },
  'post /api/blog/del': {
    auth: true,
    handle: delBlog,
  }
}

module.exports = dispatcher;
