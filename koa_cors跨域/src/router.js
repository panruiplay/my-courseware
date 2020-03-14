const router = require('koa-router')();

router.get('/sss', (ctx) => {
  ctx.body = 'get o verload';
});


router.post('/asdf', (ctx) => {
  ctx.body = 'post overload';
});

module.exports = router;
