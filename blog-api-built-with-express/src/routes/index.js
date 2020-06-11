const express = require('express');
const router = express.Router();
const loginfilter = require('../middleware/loginfilter');

// router register
const register = (method, path, loginfilter, controller) => {
  if (!controller) {
    controller = loginfilter;
    loginfilter = (req, res, next) => next();
  }
  router[method](path, loginfilter, (req, res, next) => {
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
register('post', '/blog/create', loginfilter, createBlog);
register('post', '/blog/update', loginfilter, updateBlog);
register('post', '/blog/del', loginfilter, delBlog);

register('post', '/user/login', login);
register('get', '/user/info', getUserInfo);

module.exports = router;
