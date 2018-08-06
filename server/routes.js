const router = require('koa-router')({
  prefix: '/api'
});

const lottery = require('./controllers/lottery');
const localLottery = require('./controllers/localLottery');

router.get('/lottery/list', lottery.list);
router.get('/lottery/houseInfo', lottery.houseInfo);
router.post('/lottery/regList', lottery.regList);
router.post('/sync/houseInfo', localLottery.syncHouse);
router.get('/sync/isRegSync', localLottery.isRegSync);

module.exports = router;
