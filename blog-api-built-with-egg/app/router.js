

module.exports = app => {
  const { controller } = app;
  const fileUpload = app.middleware.fileUpload({});

  app.get('/', controller.home.index);
  app.post('/api/upload/mult', fileUpload, controller.upload.mult);

  app.post(
    '/api/login',
    app.passport.authenticate('local', { 
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    }),
    async (ctx, next) => {
      ctx.body = 'success';
    },
  );

}
