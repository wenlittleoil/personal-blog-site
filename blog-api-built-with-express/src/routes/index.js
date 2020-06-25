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
    const result = controller(req, res);
    const promiseResult = 
      result instanceof Promise ? result : Promise.resolve(result);
    promiseResult.then(result => {
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
  login2,
  getUserInfo,
} = require('../controller/user');
const {
  testNeedBasicAuth,
} = require('../controller/test');

// test
register('get', '/test/need-basic-auth', testNeedBasicAuth);

// blog
register('get', '/blog/list', getBlogList);
register('get', '/blog/detail', getBlogDetail);
register('post', '/blog/create', loginfilter, createBlog);
register('post', '/blog/update', loginfilter, updateBlog);
register('post', '/blog/del', loginfilter, delBlog);

// user
register('post', '/user/login', login);
register('post', '/user/login2', login2);
register('get', '/user/info', getUserInfo);

module.exports = router;
