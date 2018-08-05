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

const insertRegList = (regList) => {
  // remove rownum
  regList = regList.map(item=>{
    delete item.rownum;
    return item;
  });
  return mysql('register').insert(regList)
}

module.exports = {
  insertHouse,
  insertRegList
}