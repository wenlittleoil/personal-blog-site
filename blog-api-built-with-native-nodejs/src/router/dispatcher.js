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
const {
  uploadText,
  uploadImg,
} = require('../controller/test');

const dispatcher = {
  // blog
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
  'post /api/blog/del': {
    auth: true,
    handle: delBlog,
  },
  
  // user
  'post /api/user/login': {
    handle: login,
  },
  'get /api/user/info': {
    handle: getUserInfo,
  },

  // test
  'get /api/test/error': {
    handle: async () => {
      throw new Error('something broken!');
      return {
        info: 'test-error',
      }
    },
  },
  'post /api/test/upload-file/text': {
    handle: uploadText,
  },
  'post /api/test/upload-file/img': {
    handle: uploadImg,
  },

}

module.exports = dispatcher;
