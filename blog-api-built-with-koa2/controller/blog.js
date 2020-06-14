const assert = require('assert');
const _ = require('lodash');
const {
  Success,
  Failure,
} = require('../model');
const blogService = require('../service/blog');
// const logger = require('../util/logger');

const BLOG_CAT = 'blog';

const getBlogList = ctx => {
  const {
    uid,
    username,
    keyword,
  } = ctx.query;
  const result = blogService.getBlogList({
    uid,
    username,
    keyword,
  });
  return result.then(data => {
    return new Success(data);
  });
}

const getBlogDetail = ctx => {
  const {
    id,
  } = ctx.query;
  assert(id, 'Missing parameters id');
  const result = blogService.getBlogDetail(id);
  return result.then(data => {
    return new Success(data);
  });
}

const createBlog = async ctx => {
  const {
    title,
    content,
  } = ctx.request.body;
  const { id: uid } = ctx.user;
  // logger.warn({
  //   cat: BLOG_CAT,
  //   name: 'create_blog',
  //   desc: 'someone is creating blog',
  //   data: {
  //     uid,
  //     title,
  //     content,
  //   }
  // });
  assert(uid && title && content, 'missing parameters uid/title/content');

  const result = await blogService.createBlog({
    uid,
    title,
    content,
  });
  
  return new Success(result);
}

const updateBlog = async ctx => {
  const {
    id,
  } = ctx.query;
  const {
    title,
    content,
  } = ctx.request.body;
  const { id: uid } = ctx.user;
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

const delBlog = async ctx => {
  const {
    id,
  } = ctx.query;
  const {
    id: uid,
  } = ctx.user;
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
