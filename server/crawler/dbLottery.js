const mysql = require('../mysql');

const insertHouse = (houseInfo) => {
  const {id, house_name, lottery_time, status} = houseInfo;
  return mysql('house').insert({
    id,
    house_name,
    lottery_time,
    status
  })
}

module.exports = {
  insertHouse
}