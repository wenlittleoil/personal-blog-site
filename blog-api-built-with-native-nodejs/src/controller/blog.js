const assert = require('assert');
const _ = require('lodash');
const {
  Success,
  Failure,
} = require('../model');
const blogService = require('../service/blog');

const getBlogList = req => {
  const {
    uid,
    username,
    keyword,
  } = req.query;
  const result = blogService.getBlogList({
    uid,
    username,
    keyword,
  });
  return result.then(data => {
    return new Success(data);
  });
}

const getBlogDetail = req => {
  const {
    id,
  } = req.query;
  assert(id, 'Missing parameters id');
  const result = blogService.getBlogDetail(id);
  return result.then(data => {
    return new Success(data);
  });
}

const createBlog = async req => {
  const {
    title,
    content,
  } = req.body;
  const { id: uid } = req.user;
  assert(uid && title && content, 'missing parameters uid/title/content');
  const result = await blogService.createBlog({
    uid,
    title,
    content,
  });
  return new Success(result);
}

const updateBlog = async req => {
  const {
    id,
  } = req.query;
  const {
    title,
    content,
  } = req.body;
  const { id: uid } = req.user;
  assert(id, 'missing parameter id');
  assert(title || content, 'missing parameter title or content');

  const updateParams = _.omitBy({
    uid,
    id,
    title,
    content,
  }, val => !val);
  const result = await blogService.updateBlog(updateParams);
  return new Success(result);
}

module.exports = {
  getBlogList,
  getBlogDetail,
  createBlog,
  updateBlog,
}
