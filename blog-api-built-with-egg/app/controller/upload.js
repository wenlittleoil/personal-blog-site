const { Controller } = require('egg');

class UploadCtl extends Controller {
  async mult() {
    const { ctx } = this;
    console.log(ctx.request.body);
    console.log(ctx.files);
    ctx.body = 'upload success';
  }
}

module.exports = UploadCtl;
