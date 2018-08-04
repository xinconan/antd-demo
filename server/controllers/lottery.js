const axios = require('axios');
const {lotteryApi} = require('../config')

// 摇号楼盘列表
const list = (ctx)=>{
  let {pageNum} = ctx.query;
  if(!pageNum) {
    pageNum = 1;
  }
  if(pageNum < 1) {
    pageNum = 1;
  }
  return axios.get(`${lotteryApi}lottery?layPage.pageNum=${pageNum}&layPage.pageSize=20`)
  .then(resp => {
    ctx.state = {
      code: 0,
      data: resp.data
    }
  })
}

// 摇号楼盘详情信息
const houseInfo = (ctx) => {
  const {id} = ctx.query;
  return axios.get(`${lotteryApi}houseDetail?houses.id=${id}`)
  .then(resp => {
    ctx.state = {
      code: 0,
      data: resp.data
    }
  })
}


// 登记列表
const regList = (ctx)=>{
  console.log(ctx.request.body)
  let {pageNum, houseId} = ctx.request.body;
  if(!houseId) {
    ctx.state = {
      code: -1,
      msg: '确实必要参数'
    }
    return;
  }
  if(!pageNum) {
    pageNum = 1;
  }
  if(pageNum < 1) {
    pageNum = 1;
  }
  return axios.get(`${lotteryApi}registrationList?layPage.pageNum=${pageNum}&layPage.pageSize=20&houses.id=${houseId}`)
  .then(resp => {
    ctx.state = {
      code: 0,
      data: resp.data
    }
  })
}

module.exports = {
  list,
  regList,
  houseInfo
}