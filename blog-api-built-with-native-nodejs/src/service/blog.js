const getBlogList = req => {
  return [{
    id: 1,
    title: 'aaa',
    content: 'AAA',
  }];
}

const getBlogDetail = req => {
  return {
    id: 1,
    title: 'aaa',
    content: 'AAA',
  }
}

const createBlog = req => {
  return {
    id: 6,
  }
}

const updateBlog = req => {
  return {
    id: 8,
  }
}

module.exports = {
  getBlogList,
  getBlogDetail,
  createBlog,
  updateBlog,
}
