const assert = require('assert');
const _ = require('lodash');
const {
  Success,
  Failure,
} = require('../model');
const blogService = require('../service/blog');
const logger = require('../util/logger');

const BLOG_CAT = 'blog';

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
  logger.warn({
    cat: BLOG_CAT,
    name: 'create_blog',
    desc: 'someone is creating blog',
    data: {
      uid,
      title,
      content,
    }
  });
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
  const {
    affectedRows,
  } = result;
  if (affectedRows > 0) {
    return new Success('update successfully');
  }
  return new Failure('update fail');
}

const delBlog = async req => {
  const {
    id,
  } = req.query;
  const {
    id: uid,
  } = req.user;
  const result = await blogService.updateBlog({
    id,
    uid,
    status: 0,
  });
  const {
    affectedRows,
  } = result;
  if (affectedRows > 0) {
    return new Success('delete successfully');
  }
  return new Failure('delete fail');
  
}

module.exports = {
  getBlogList,
  getBlogDetail,
  createBlog,
  updateBlog,
  delBlog,
}
