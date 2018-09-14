import {message} from 'antd'

export default{
  success(msg){
    message.success(msg);
  },
  error(msg){
    message.error(msg);
  }
}