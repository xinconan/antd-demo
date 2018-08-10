const mysql = require('../mysql');

// 插入houseInfo信息
const insertHouse = async(houseInfo) => {
  const {id, house_name, lottery_time, status, homeless_number, total_people, house_number, homeless_people} = houseInfo;
  // 如果有该数据，直接更新
  let house = await mysql('house').select().where('id', id);
  if(house.length) {
    return mysql('house').update({
      ...house[0],
      ...houseInfo
    }).where('id',id);
  }else {
    return mysql('house').insert({
      id,
      house_name,
      lottery_time,
      status,
      homeless_number,
      total_people,
      house_number,
      homeless_people
    })
  }
}

// 批量插入登记表
const insertRegList = (regList) => {
  // remove rownum
  regList = regList.map(item=>{
    delete item.rownum;
    return item;
  });
  return mysql('register').insert(regList)
}

// 更新摇号结果到登记表中
const updateReg = (reg) => {
  // 返回的id不是登记表的id
  delete reg.id;
  delete reg.rownum;
  return mysql('register').update(reg).where('serial_number', reg.serial_number);
}

// 批量更新登记表
const updateRegList = async(regList) => {
  // TODO: 优化，一条一条更新太慢了，除了建临时表还没想到其他方法
  for(const item of regList){
    await updateReg(item);
  }
}

// 是否同步登记报名表
const isRegSync = (houseId) => {
  return mysql('house').select('reg_sync', 'result_sync').where('id', houseId)
}

// 更新报名表同步状态
const updateSyncRegStatus = (houseId) => {
  return mysql('house')
  .update({
    reg_sync: 1
  }).where('id', houseId);
}

// 更新摇号结果同步状态
const updateSyncResultStatus = (houseId) => {
  return mysql('house')
  .update({
    result_sync: 1
  }).where('id', houseId);
}

module.exports = {
  insertHouse,
  insertRegList,
  isRegSync,
  updateRegList,
  updateSyncRegStatus,
  updateSyncResultStatus
}