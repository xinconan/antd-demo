const axios = require('axios')

const list = (ctx)=>{
  return axios.get('https://miniprogram.hz-notary.com/app/api/lottery?layPage.pageNum=1&layPage.pageSize=20')
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