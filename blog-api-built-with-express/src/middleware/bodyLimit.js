const errorTip = {
  message: 'request body length exceed',
}

module.exports = (options = {}) => {
  const defaultOptions = {
    bytesLimit: 5000,
    exceptTypes: ['multipart/form-data']
  }
  const useOptions = Object.assign({}, defaultOptions, options);

  const {
    bytesLimit,
    exceptTypes,
  } = useOptions;
  
  return (req, res, next) => {
    if (req.method !== 'POST') {
      next();
      return;
    }

    const contentType= req.headers['content-type'];
    if (exceptTypes.includes(contentType)) {
      next();
      return;
    }

    const contentLength = parseInt(req.headers['content-length'], 10);
    if (contentLength && contentLength > bytesLimit) {
      res.end(JSON.stringify(errorTip));
      return;
    }

    let received = 0;
    req.on('data', chunk => {
      received += chunk.length;
      if (received > bytesLimit) {
        res.end(JSON.stringify(errorTip));
        req.destroy();
        return;
      }
    });

    next();
  }
}