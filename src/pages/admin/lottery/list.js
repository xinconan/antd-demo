import React, { Component } from 'react';
import { Button, Modal,Table, Progress } from 'antd';
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
      width: 150,
      render: text => (
        <span>
          {text===1?'已摇号':'待摇号'}
        </span>
      )
    },{
      title: '操作',
      dataIndex: 'id',
      width: 300,
      render: (text,record)=>(
        <span>
          <Button type="primary" className="x-mgr" onClick={()=>this.getHouseInfo(text)}>楼盘信息</Button>
          <Button type="primary" className="x-mgr" icon="sync" onClick={()=>this.syncRegList(text)}></Button>
          <NavLink to={`/admin/lottery/regList/${text}`}>登记报名表</NavLink>
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
      if (res.status === 200 && res.data.code===0) {
        this.setState({
          showModal: true,
          houseInfo: res.data.data.data
        });
      }
    })
  }
  // sync 同步登记
  syncRegList(houseId){
    socket.emit('task', {houseId})
    console.log(houseId)
  }
  fetch = (params={pageNum:1})=>{
    this.setState({ loading: true });
    axios.get('/api/lottery/list', {
      params
    }).then((res) => {
      if (res.status === 200 && res.data.code===0) {
        const data = res.data.data;
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
      }
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
    })
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
      if(resp.data.code===0){
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