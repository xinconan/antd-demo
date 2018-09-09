const axios = require('axios');
const {lotteryApi} = require('../config');
const db = require('../crawler/dbLottery');
const mysql = require('../mysql');
const utils = require('../utils');

const syncHouse = async(ctx)=>{
  if(ctx.request.body.id) {
    await db.insertHouse(ctx.request.body);
    ctx.state = {
      code: 0,
      data: true
    }
  }
}

// 获取某个楼盘的同步状态
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

// 添加楼盘信息到house_old表中
const addHouse = async (ctx) =>{
  const {house_name, lottery_time, homeless_number, total_people, house_number, homeless_people} = ctx.request.body;
  if(!house_name) {
    ctx.body = {
      code: -1,
      msg: '楼盘名不能为空'
    }
    return;
  }
  const id = utils.getUuid();
  await mysql('house_old').insert({
    id,
    house_name,
    lottery_time,
    homeless_number,
    total_people,
    house_number,
    homeless_people
  });
  ctx.state = {
    code: 0,
    data: true
  }
}

module.exports = {
  syncHouse,
  isRegSync,
  addHouse
}