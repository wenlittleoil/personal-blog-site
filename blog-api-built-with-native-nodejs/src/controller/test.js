const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

exports.uploadText = async req => {

  return 'success';

  /**
   * formidable has handle multipart/form-data file upload beforeward,
   * so the end event won't be emitted afterward
   */
  // return new Promise((resolve, reject) => {
  //   const chunks = [];
  //   let size = 0;
  //   req.on('data', chunk => {
  //     chunks.push(chunk);
  //     size += chunk.length;
  //   });
  //   req.on('end', () => {
  //     const buf = Buffer.concat(chunks, size);

  //     // 1. output body formdata to console
  //     const str = iconv.decode(buf, 'utf-8');
  //     console.log('accept text: \n' + str);

  //     // 2. output body formdata to local filesystem
  //     const rs = new stream.Readable({
  //       read() {
  //         this.push(buf);
  //         this.push(null);
  //       },
  //     });
  //     const filePath = path.resolve(__dirname, '../../files', 'my-test01.txt');
  //     const ws = fs.createWriteStream(filePath, {
  //       flags: 'a',
  //     });
  //     rs.pipe(ws);

  //     // 3. end the response
  //     resolve('upload text file success');
  //   });
  // });
}

exports.uploadFile = async req => {
  if (req.multFormDataBody) {
    console.log('multipart/form-data body: \n', req.multFormDataBody);
    return 'upload file success';
  }
  return 'upload file fail';
}
