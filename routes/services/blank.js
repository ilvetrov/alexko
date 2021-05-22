var express = require('express');
var router = express.Router();

router.get('/blank', function(req, res, next) {
  const width = Number(req.query.width) || 100;
  const height = Number(req.query.height) || 100;
  res.header('Content-Type', 'image/svg+xml');
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path fill="#e8eaf1" d="M0 0h${width}v${height}H0z"/></svg>`);
});

module.exports = router;
