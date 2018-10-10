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
}