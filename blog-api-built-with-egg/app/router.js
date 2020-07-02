
module.exports = app => {
  const { controller } = app;
  const fileUpload = app.middleware.fileUpload({});

  app.get('/', controller.home.index);
  app.post('/api/upload/mult', fileUpload, controller.upload.mult);
}
