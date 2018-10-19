import utils from './utils';

describe('util test getLastTime', ()=>{
  it('test 3hours before', function(){
    // 3小时，如果刚好是3小时的话，有时会被认为是20小时
    let time = utils.getLastTime(Date.now()-10790000);
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

describe('util test getUaValue', ()=>{
  it('test AlipayClient', ()=>{
    const ua = 'Mozilla/5.0 (Linux; U; Android 6.0.1; zh-CN; Redmi 4X Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.3.8.909 UWS/2.10.2.5 Mobile Safari/537.36 UCBS/2.10.2.5 Nebula AlipayDefined(nt:WIFI,ws:360|0|2.0) AliApp(AP/10.0.18.062203) AlipayClient/10.0.18.062203 Language/zh-Hans useStatusBar/true';
    expect(utils.getUaValue(ua, 'AlipayClient')).toBe('10.0.18.062203')
  });
  // 自定义的
  it('test YunClient', ()=>{
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1  YunClient/2.9'
    expect(utils.getUaValue(ua, 'YunClient')).toBe('2.9')
  })
})

describe('util test compareVersion', ()=>{
  it('test a gt b', ()=>{
    expect(utils.compareVersion('2.9.4', '2.9.3')).toBe(1)
  });
  it('test a lt b', ()=>{
    expect(utils.compareVersion('2.9', '2.9.4')).toBe(-1)
  })
})
