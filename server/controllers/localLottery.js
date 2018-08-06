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

const isRegSync = async(ctx)=>{
  let {id} = ctx.query;
  if(id) {
    let sync = await db.isRegSync(id);
    if(sync.length){
      ctx.state = {
        code: 0,
        data: sync[0]
      }
    }else{
      ctx.state = {
        code: -1,
        msg: '该信息未同步，请先同步楼盘信息'
      }
    }
  }else {
    ctx.state = {
      code: -1,
      msg: 'id不能为空'
    }
  }
}

module.exports = {
  syncHouse,
  isRegSync
}