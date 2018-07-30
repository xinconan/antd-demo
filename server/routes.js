const router = require('koa-router')({
  prefix: '/api'
});

const lottery = require('./controllers/lottery');

router.get('/lottery/list', lottery.list);
router.get('/lottery/houseInfo', lottery.houseInfo);

module.exports = router;
