import React, { Component } from 'react';
import { Button, message, Modal,Table, Progress } from 'antd';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import io from 'socket.io-client'
const socket = io()
class Lottery extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [], // 列表值
      list: {}, // 总列表，本地缓存
      pagination: {
        defaultPageSize: 20
      },
      houseInfo: {},
      loading: true,
      showModal: false,
      showProgress: false, // 进度条
    };
    this.columns = [{
      title: '摇号楼盘',
      dataIndex: 'house_name',
    }, {
      title: '摇号时间',
      dataIndex: 'lottery_time',
      width: 200,
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: text => (
        <span>
          {text===1?'已摇号':'待摇号'}
        </span>
      )
    },{
      title: '操作',
      dataIndex: 'id',
      width: 400,
      render: (text,record)=>(
        <span>
          <Button type="primary" className="x-mgr" onClick={()=>this.getHouseInfo(text)}>详情</Button>
          <Button type="primary" className="x-mgr" onClick={()=>this.syncRegList(text)}>同步报名表</Button>
          {// 已经摇号的才能同步
            record.status === 1&&
          <Button type="primary" className="x-mgr" icon="sync" onClick={()=>this.syncResultList(text)}>同步结果</Button>
          }
          <NavLink to={`/admin/lottery/regList/${text}`}>报名表</NavLink>
        </span>
      )
    }];
  }
  // 请求不同页面数据
  handleTableChange = (pagination) => {
    console.log(pagination)
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    // 如果当前页面数据请求过，不走服务器
    if(this.state.list[pager.current]) {
      this.setState({
        data: this.state.list[pager.current]
      });
      return;
    }
    this.fetch({
      pageNum: pagination.current,
    });
  }
  // 获取楼盘详情
  getHouseInfo(id){
    axios.get('/api/lottery/houseInfo', {
      params: {
        id
      }
    }).then(res=>{
      this.setState({
        showModal: true,
        houseInfo: res.data.data
      });
    })
  }
  // sync 同步登记
  async syncRegList(houseId){
    let status = await axios.get('/api/sync/isRegSync', {
      params: {id: houseId}
    });
    // status = status.data;
    if(status.code === 0) {
      if(status.data.reg_sync === 1) {
        message.info('该信息已同步！');
      }else {
        socket.emit('task', {houseId, type: 'reg'})
      }
    }
  }
  // sync 同步登记结果
  async syncResultList(houseId){
    let status = await axios.get('/api/sync/isRegSync', {
      params: {id: houseId}
    });
    if(status.code === 0) {
      if(status.data.reg_sync !== 1) {
        message.error('请先同步报名表！');
      }else if(status.data.result_sync === 1){
        message.info('该信息已同步！');
      }else {
        socket.emit('task', {houseId, type: 'result'})
      }
    }
  }
  fetch = (params={pageNum:1})=>{
    this.setState({ loading: true });
    axios.get('/api/lottery/list', {
      params
    }).then((res) => {
      const data = res.data;
      const pagination = { ...this.state.pagination };
      const list = { ...this.state.list };
      pagination.total = data.rowCnt; // 总数量
      list[params.pageNum] = data.dataList; // 缓存
      this.setState({
        loading: false,
        data: data.dataList,
        list,
        pagination
      });
    })
  }
  componentDidMount(){
    this.fetch();
    // 同步进度显示
    socket.on('process', msg=>{
      this.setState({
        showProgress: true,
        progress: (msg*100).toFixed(0)*1
      });
    });
    socket.on('errMsg', msg => {
      message.error(msg || '发生未知错误!')
    });
  }
  handleOk = (e) => {
    this.setState({
      showModal: false,
    });
  }
  hideProgress =(e)=>{
    this.setState({
      showProgress: false
    });
  }
  syncHouse(){
    const {houseInfo} = this.state;
    axios.post('/api/sync/houseInfo', houseInfo)
    .then(resp => {
      if(resp.code===0){
        Modal.success({
          title: '同步成功',
          content: `${houseInfo.house_name} 信息同步成功！`
        });
        this.setState({
          showModal: false
        });
      }else {
        Modal.error({
          title: '同步失败',
          content: `${houseInfo.house_name} 信息同步失败！原因：${resp.data.error}`
        });
      }
    })
  }
  updateHouse(){
    const {houseInfo} = this.state;
    this.props.history.push(`/admin/lottery/house/${houseInfo.id}`);
  }
  render() { 
    const {houseInfo} = this.state;
    return (
      <div className="x-bg">
        <Table columns={this.columns} 
          dataSource={this.state.data} 
          rowKey={record => record.id}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          loading={this.state.loading}
          scroll={{ y: 600 }}
        />
        <Modal
          title={houseInfo.house_name}
          visible={this.state.showModal}
          closable={false}
          footer={(
            <div>
              <Button type="primary" onClick={()=>this.syncHouse()}>同步</Button>
              <Button type="primary" onClick={()=>this.updateHouse()}>修改</Button>
              <Button type="primary" onClick={()=>this.handleOk()}>确定</Button>
            </div>
          )}
        >
          <p>登记总数：{houseInfo.total_people}</p>
          <p>无房家庭：{houseInfo.homeless_people}</p>
          <p>可售房源套数：{houseInfo.house_number}</p>
          <p>无房家庭套数：{houseInfo.homeless_number}</p>
          <p>摇号时间：{houseInfo.lottery_time}</p>
        </Modal>
        <Modal
          title="同步"
          visible={this.state.showProgress}
          closable={false}
          footer={<Button type="primary" onClick={()=>this.hideProgress()}>确定</Button>}
        >
          <p>开始同步</p>
          <Progress percent={this.state.progress}/>
        </Modal>
      </div>
    );
  }
}
 
export default Lottery;