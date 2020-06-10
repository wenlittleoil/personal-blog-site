const express = require('express');

const router = express.Router();

router.post('/abc', (req, res, next) => {
  console.log(req.body);
  res.json({
    method: req.method,
    url: req.url,
  });
});

module.exports = router;
