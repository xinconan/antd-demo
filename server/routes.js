const router = require('koa-router')({
  prefix: '/api'
});

const lottery = require('./controllers/lottery');

router.get('/lottery/list', lottery.list);
router.get('/lottery/houseInfo', lottery.houseInfo);
router.post('/lottery/regList', lottery.regList);

module.exports = router;
