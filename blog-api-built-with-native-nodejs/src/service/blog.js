const blogDao = require('../dao/blog');

function Service() {
  return {

    getBlogList: ({
      uid,
      username,
      keyword,
    }) => {
      const result = blogDao.getBlogList({
        uid,
        username,
        keyword,
      });
      return result;
    },
    
    getBlogDetail: async id => {
      const result = await blogDao.getBlogDetail(id);
      return result[0];
    },
    
    createBlog: async ({
      uid,
      title,
      content,
    }) => {
      const result = await blogDao.createBlog({
        uid,
        title,
        content,
      });
      return {
        id: result.insertId,
      }
    },
    
    updateBlog: async params => {
      const result = await blogDao.updateBlog(params);
      return {
        id: params.id,
      }
    },
  }
}

module.exports = Service();
