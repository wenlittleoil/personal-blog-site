const { Controller } = require('egg');

class HomeCtl extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hello world';
  }
}

module.exports = HomeCtl;
