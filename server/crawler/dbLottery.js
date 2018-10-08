const mysql = require('../mysql');

// 插入houseInfo信息
const insertHouse = async(houseInfo) => {
  const {
    id, 
    house_name, 
    alias,
    lottery_time, 
    status, 
    homeless_number, 
    total_people, 
    house_number, 
    homeless_people,
    average_price,
    main_house_type,
    deposit,
  } = houseInfo;
  // 如果有该数据，直接更新
  let house = await mysql('house').select().where('id', id);
  if(house.length) {
    return mysql('house').update({
      ...house[0],
      house_name, 
      alias,
      lottery_time, 
      status, 
      homeless_number, 
      total_people, 
      house_number, 
      homeless_people,
      average_price,
      main_house_type,
      deposit,
    }).where('id',id);
  }else {
    return mysql('house').insert({
      id,
      alias,
      house_name,
      lottery_time,
      status,
      homeless_number,
      total_people,
      house_number,
      homeless_people,
      average_price,
      main_house_type,
      deposit,
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
const updateRegList = async(regList, houseId) => {
  // remove rownum, add house_id
  regList = regList.map(item=>{
    delete item.rownum;
    item.house_id = houseId;
    return item;
  });
  // save to result table
  return mysql('result').insert(regList);
}

// update rank in register table
const syncRankToReg = (houseId)=> {
  const queryStr = `update register left join result on register.serial_number = result.serial_number
   set register.rank = result.rank 
    where  result.house_id=?`;
  return mysql.raw(queryStr, [houseId]);
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
    result_sync: 1,
    status: 1,  // 更新了摇号结果，同步更新楼盘状态为已摇号
  }).where('id', houseId);
}

module.exports = {
  insertHouse,
  insertRegList,
  isRegSync,
  syncRankToReg,
  updateRegList,
  updateSyncRegStatus,
  updateSyncResultStatus
}