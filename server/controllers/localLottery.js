const moment = require('moment');
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
  const {house_name, alias, lottery_time, homeless_number, total_people, house_number, homeless_people} = ctx.request.body;
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
    alias,
    status: 1, // old 表中都是已经摇过号的
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

// 获取楼盘信息
const getHouseInfo = async(ctx) => {
  const {id} = ctx.query;
  if(!id) {
    ctx.state = {
      code: -1,
      msg: 'id不能为空'
    }
    return;
  }
  let house = await mysql('house').select().where('id', id);
  if(house.length) {
    ctx.state = {
      code: 0,
      data: house[0]
    }
  }else{
    ctx.body={
      code: -1,
      msg: '无效的id'
    }
  }
}

// 分页获取楼盘列表, 从0开始
const getHouseList = async(ctx)=>{
  let {pageNum, pageSize, name} = ctx.query;
  if(typeof pageNum	=== 'undefined' || pageNum < 0) {
    pageNum = 0;
  }
  if(typeof pageSize === 'undefined') {
    pageSize = 20;
  }
  if(pageSize < 1 || pageSize > 20) {
    pageSize = 20;
  }
  console.log('pageNum: '+pageNum + ' pageSize: '+ pageSize)

  // 总记录   [{"count(*)":112}]
  let total = 0;
  if(name){
    total = await mysql('house').count()
            .where('house_name', 'like', `%${name}%`)
            .orWhere('alias', 'like', `%${name}%`);
  }else{
    total = await mysql('house').count();
  }
  total = total[0]['count(*)'];  // 需要这样获取，有点反人类
  let totalPage = Math.ceil(total / pageSize) ;
  let data = {
    total,
    totalPage: totalPage, // 总页数
    pageNum: pageNum,
    pageSize: pageSize,
    hasNext: pageNum < totalPage - 1,  // 是否还有下一页
  }

  // 查询
  // select * from house order by lottery_time desc limit 10 offset 0;
  let list;
  if(name){
    list = await mysql('house').orderBy('lottery_time', 'desc')
            .limit(pageSize).offset(pageNum*pageSize)
            .where('house_name', 'like', `%${name}%`)
            .orWhere('alias', 'like', `%${name}%`);
  }else{
    list = await mysql('house').orderBy('lottery_time', 'desc')
            .limit(pageSize).offset(pageNum*pageSize);
  }
  list.map(item=> item.lottery_time = moment(item.lottery_time).format('YYYY-MM-DD HH:mm:ss'))
  data.list = list;
  ctx.state = {
    code: 0,
    data: data
  }
}

module.exports = {
  syncHouse,
  isRegSync,
  addHouse,
  getHouseInfo,
  getHouseList
}