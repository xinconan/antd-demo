const uuid = require('uuid/v1');

const getUuid = ()=>{
  let u = uuid();
  // remove -
  u = u.replace(/-/ig,'');
  return u;
}

module.exports = {
  getUuid
}