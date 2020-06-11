const express = require('express');
const router = express.Router();

// router register
const register = (method, path, controller) => {
  router[method](path, (req, res, next) => {
    controller(req).then(result => {
      res.json(result);
    });
  });
}

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

register('get', '/blog/list', getBlogList);
register('get', '/blog/detail', getBlogDetail);
register('post', '/blog/create', createBlog);
register('post', '/blog/update', updateBlog);
register('post', '/blog/del', delBlog);

register('post', '/user/login', login);
register('get', '/user/info', getUserInfo);

module.exports = router;
