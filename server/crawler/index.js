const axios = require('axios');
const mysql = require('../mysql');
const {
  insertRegList, 
  updateRegList, 
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

const syncResultList = async (houseId, socket) => {
  let pageNum = 1;
  let pageCount = 1;
  do{
    let list = await axios.get(`${lotteryApi}resultList?layPage.pageNum=${pageNum}&layPage.pageSize=50&houses.id=${houseId}`)
    pageCount = list.data.pageCnt;
    if(!pageCount) {
      socket.emit('errMsg', '未获取到数据');
    }else{
      await updateRegList(list.data.dataList);
      socket.emit('process', pageNum/pageCount)
      pageNum++;
    }
  }while(pageNum<=pageCount);
  if(pageCount){
    // 更新同步状态
    await updateSyncResultStatus(houseId);
  }
}

module.exports = {
  syncRegList,
  syncResultList
}