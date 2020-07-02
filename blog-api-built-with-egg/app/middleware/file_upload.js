const formidable = require('formidable');
const path = require('path');

module.exports = options => {
  return async (ctx, next) => {

    const type = ctx.request.header['content-type'];
    if (
      ctx.method.toLowerCase() !== 'post' ||
      !type ||
      type.indexOf('multipart/form-data') === -1
    ) {
      await next();
      return;
    }

    const form = formidable({ 
      multiples: true, // contain arrays of files for inputs which submit multiple files using the HTML5 multiple attribute
      uploadDir: path.resolve(__dirname, '../../files'), // the directory for placing file uploads in, default os.tmpdir()
      maxFileSize: 200 * 1024 * 1024, // limit the size of the upload files, unit bytes
      maxFields: 20, // limit the number of fields
    });
    await new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        ctx.request.body = fields;
        ctx.files = files;
        resolve();
      });
    });
    await next();
  }
}
