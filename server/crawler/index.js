const axios = require('axios');
const mysql = require('../mysql');
const {
  insertRegList, 
  updateRegList, 
  syncRankToReg,
  updateSyncRegStatus, 
  updateSyncResultStatus
} = require('./dbLottery');
const {lotteryApi} = require('../config');

const syncRegList = async(houseId, socket) =>{
  let pageNum = 1;
  let pageCount = 1;
  do{
    let list = await axios.get(`${lotteryApi}registrationList?layPage.pageNum=${pageNum}&layPage.pageSize=50&houses.id=${houseId}`)
    pageCount = list.data.pageCnt;
    if(!pageCount) {
      socket.emit('errMsg', '未获取到数据');
    }else{
      await insertRegList(list.data.dataList);
      socket.emit('process', pageNum/pageCount)
      pageNum++;
    }
  }while(pageNum<=pageCount);
  if(pageCount){
    // 更新同步状态
    await updateSyncRegStatus(houseId);
  }
}

// 同步摇号结果，先将结果同步到result表中，然后更新对应的rank到register表中
const syncResultList = async (houseId, socket) => {
  let pageNum = 1;
  let pageCount = 1;
  do{
    let list = await axios.get(`${lotteryApi}resultList?layPage.pageNum=${pageNum}&layPage.pageSize=50&houses.id=${houseId}`)
    pageCount = list.data.pageCnt;
    if(!pageCount) {
      socket.emit('errMsg', '未获取到数据');
    }else{
      await updateRegList(list.data.dataList, houseId);
      socket.emit('process', pageNum/pageCount)
      pageNum++;
    }
  }while(pageNum<=pageCount);
  if(pageCount){
    // 更新同步状态
    await updateSyncResultStatus(houseId);
    // TODO: 同步摇号结果到登记表中，这块还是执行很慢。。
    await syncRankToReg(houseId);
  }
}

module.exports = {
  syncRegList,
  syncResultList
}