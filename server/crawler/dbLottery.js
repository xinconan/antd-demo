const mysql = require('../mysql');

// 插入houseInfo信息
const insertHouse = (houseInfo) => {
  const {id, house_name, lottery_time, status, homeless_number, total_people, house_number, homeless_people} = houseInfo;
  // TODO: 如果有该数据，直接更新
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

module.exports = {
  insertHouse
}