import utils from './utils';

describe('util test getLastTime', ()=>{
  it('test 3hours before', function(){
    // 3小时
    let time = utils.getLastTime(Date.now()-10800000);
    expect(time).toBe('21小时')
  });

  it('test 25hours before', function(){
    let time = utils.getLastTime(Date.now()-25*3600000);
    expect(time).toBe('0小时')
  });
  it('test 30minutes left', function(){
    let time = utils.getLastTime(Date.now()-24*3600000+30*60*1000);
    expect(time).toBe('30分钟')
  });

})

describe('util test getWxSign', ()=>{
  const signStr = 'appid=wx578e61bc215aeaa0|noncestr=c515i435t4gs8b94ie25bvatfv2pl899|package=prepay_id=|signType=MD5|timestamp=1539139173|sign=9C7BB20DB3FE6EB333E740D0122D3B34';
  const signObj = utils.getWxSign(signStr);
  it('test empty',()=>{
    expect(utils.getWxSign()).toEqual({})
  })
  it('test appid',()=>{
    expect(signObj.appid).toBe('wx578e61bc215aeaa0');
  });
  it('test noncestr',()=>{
    expect(signObj.noncestr).toBe('c515i435t4gs8b94ie25bvatfv2pl899');
  });
  it('test package',()=>{
    expect(signObj.package).toBe('prepay_id=');
  });
  it('test signType',()=>{
    expect(signObj.signType).toBe('MD5');
  });
  it('test sign',()=>{
    expect(signObj.sign).toBe('9C7BB20DB3FE6EB333E740D0122D3B34');
  });
})
