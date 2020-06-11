class Basic {
  constructor() {
  }
}

class Success extends Basic {
  constructor(data = null) {
    super();
    this.errno = 0;
    this.msg = 'success';
    this.data = data;
  }
}

class Failure extends Basic {
  constructor(data = null) {
    super();
    this.errno = 1;
    this.msg = 'failture';
    this.data = data;
  }
}

module.exports = {
  Success,
  Failure,
}
