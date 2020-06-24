const Router = require('koa-router');
const loginfilter = require('../middleware/loginfilter')();

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

const router = new Router({
  prefix: '/api',
});

// test
router.get('/test-session', async (ctx, next) => {
  ctx.body = 'test session';
  let counts = ctx.session.viewcounts || 0;
  ctx.session.viewcounts = ++counts;
  await next();
});
router.get('/test-no-db', async (ctx, next) => {
  ctx.body = 'test no db';
  await next();
});

// blog
router.get('/blog/list', async (ctx, next) => {
  const result = await getBlogList(ctx);
  ctx.body = result;
});
router.get('/blog/detail', async (ctx, next) => {
  const result = await getBlogDetail(ctx);
  ctx.body = result;
});
router.post('/blog/create', loginfilter, async (ctx, next) => {
  const result = await createBlog(ctx);
  ctx.body = result;
});
router.post('/blog/update', loginfilter, async (ctx, next) => {
  const result = await updateBlog(ctx);
  ctx.body = result;
});
router.post('/blog/del', loginfilter, async (ctx, next) => {
  const result = await delBlog(ctx);
  ctx.body = result;
});

// user
router.post('/user/login', async (ctx, next) => {
  const result = await login(ctx);
  ctx.body = result;
});
router.get('/user/info', async (ctx, next) => {
  const result = await getUserInfo(ctx);
  ctx.body = result;
});

module.exports = router
