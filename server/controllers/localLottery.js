const axios = require('axios');
const {lotteryApi} = require('../config');
const db = require('../crawler/dbLottery');

const syncHouse = async(ctx)=>{
  if(ctx.request.body.id) {
    await db.insertHouse(ctx.request.body);
    ctx.state = {
      code: 0,
      data: true
    }
  }
}

module.exports = {
  syncHouse
}