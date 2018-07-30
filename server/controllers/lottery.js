const axios = require('axios');
const API = 'https://miniprogram.hz-notary.com/app/api/';

const list = (ctx)=>{
  let {pageNum} = ctx.query;
  if(!pageNum) {
    pageNum = 1;
  }
  if(pageNum < 1) {
    pageNum = 1;
  }
  return axios.get(`${API}lottery?layPage.pageNum=${pageNum}&layPage.pageSize=20`)
  .then(resp => {
    console.log(resp.data)
    ctx.state = {
      code: 0,
      data: resp.data
    }
  })
}

module.exports = {
  list,
}