import {message} from 'antd'
import moment from 'moment';

export default{
  success(msg){
    message.success(msg);
  },
  error(msg){
    message.error(msg);
  },
  // 指定时间距离24小时还有多久结束
  getLastTime: function(time){
    const now = moment();
    let last = moment(time);
    last = last.add(1, 'days');
    let diff = last.diff(now, 'hours');
    if(diff>0) return diff+'小时';
    if(diff<0) return '0小时';
    diff = last.diff(now, 'minutes');
    return diff + '分钟'
  },
  // 获取微信支付签名信息
  getWxSign: function(signStr){
    // appid=wx578e61bc215aeaa0|noncestr=c515i435t4gs8b94ie25bvatfv2pl899|package=prepay_id=|signType=MD5|timestamp=1539139173|sign=9C7BB20DB3FE6EB333E740D0122D3B34
    let sign = {};
    if(!signStr) return sign;
    const arr = signStr.split('|');
    for(let i=0;i<arr.length;i++) {
      // 使用indexOf获取=位置，
      // 不使用match匹配一次，因为是从右边匹配的，
      // 'package=prepay_id='  match(/(.*)=(.*)/)  => package=prepay_id  '' 期望的是 'package','prepay_id='
      let v = arr[i];
      let idx = v.indexOf('=');
      let key = v.substring(0,idx);
      let value = v.substring(idx+1);
      sign[key] = value;
    }
    return sign;
  },
  /**
   * 获取ua中指定key对应的值，如支付宝版本号AlipayClient
   * @param {*} ua 
   * @param {*} key 
   */
  getUaValue(ua, key){
    const version = ua.match(new RegExp(`${key}/(.*)`));
    if(version && version.length) {
      return version[1].split(' ')[0]
    }else{
      return ''
    }
  },
  /**
   * 比较两个给定的版本号（x.y.z形式，符合semver规范），
   * va大于vb返回1，va小于vb返回-1，相等返回0
   * 如果需要更复杂的比较，可以使用semver包比较
   * @param {*} va 
   * @param {*} vb 
   */
  compareVersion: function(va, vb){
    const v1 = va.split('.');
    const v2 = vb.split('.');
    return this.compare(v1[0], v2[0]) ||
          this.compare(v1[1], v2[1]) ||
          this.compare(v1[2], v2[2]);
  },
  compare(a,b){
    // to number
    if(a && b) {
      a = +a;
      b = +b;
    }
    return (a && !b)? 1
        : (b && !a) ? -1
        : a < b ? -1
        : a > b ? 1
        : 0;
  }
}