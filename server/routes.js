const router = require('koa-router')({
  prefix: '/api'
});

const lottery = require('./controllers/lottery');
const localLottery = require('./controllers/localLottery');

router.get('/lottery/list', lottery.list);
router.get('/lottery/houseInfo', lottery.houseInfo);
router.get('/lottery/dbHouseInfo', localLottery.getHouseInfo);
router.post('/lottery/regList', lottery.regList);
router.post('/sync/houseInfo', localLottery.syncHouse);
router.get('/sync/isRegSync', localLottery.isRegSync);
router.post('/lottery/addHouse', localLottery.addHouse);

module.exports = router;
