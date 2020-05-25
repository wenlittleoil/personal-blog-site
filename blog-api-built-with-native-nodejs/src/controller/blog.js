const blog = require('../service/blog');
const {
  Success,
  Failure,
} = require('../model');

const getBlogList = req => {
  const {
    uid,
  } = req.query;
  const result = blog.getBlogList(uid);
  return new Success(result);
}

const getBlogDetail = req => {
  const {
    id,
  } = req.query;
  const result = blog.getBlogDetail(id);
  return new Failure(result);
}

const createBlog = req => {
  const {
    title,
    content,
  } = req.body;
  const result = blog.createBlog({
    title,
    content,
  });
  return result;
}

const updateBlog = req => {
  const {
    id,
    title,
    content,
  } = req.body;
  const result = blog.updateBlog({
    id,
    title,
    content,
  });
  return result;
}

module.exports = {
  getBlogList,
  getBlogDetail,
  createBlog,
  updateBlog,
}
