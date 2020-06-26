const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

exports.uploadText = async req => {
  
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      chunks.push(chunk);
      size += chunk.length;
    });
    req.on('end', () => {
      const buf = Buffer.concat(chunks, size);

      // 1. output body formdata to console
      const str = iconv.decode(buf, 'utf-8');
      console.log('accept text: \n' + str);

      // 2. output body formdata to local filesystem
      const rs = new stream.Readable({
        read() {
          this.push(buf);
          this.push(null);
        },
      });
      const filePath = path.resolve(__dirname, '../../files/texts', 'my-test01.txt');
      const ws = fs.createWriteStream(filePath, {
        flags: 'a',
      });
      rs.pipe(ws);

      // 3. end the response
      resolve('upload text file success');
    });
  });
}

exports.uploadImg = async req => {
  return 'success'
}
