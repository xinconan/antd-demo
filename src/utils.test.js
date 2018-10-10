import utils from './utils';

describe('util test', ()=>{
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
