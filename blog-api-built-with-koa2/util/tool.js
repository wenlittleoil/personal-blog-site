const fs = require('fs');

const isExists = file => {
  return new Promise(resolve => {
    fs.access(file, err => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

const mkdir = dir => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, err => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

module.exports = {
  isExists,
  mkdir,
}