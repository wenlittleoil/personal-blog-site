
module.exports = app => {
  const { controller } = app;
  app.get('/', controller.home.index);
}
