import React, { Component } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const columns = [{
  title: '摇号楼盘',
  dataIndex: 'house_name',
  
}, {
  title: '摇号时间',
  dataIndex: 'lottery_time',
  width: 200,
}, {
  title: '状态',
  dataIndex: 'status',
  width: 220,
  render: text => (
    <span>
      {text===1?'已摇号':'待摇号'}
    </span>
  )
}];

class Lottery extends Component {
  state = {
    data: [], // 列表值
    list: {}, // 总列表，本地缓存
    pagination: {
      defaultPageSize: 20
    },
    loading: true,
  };

  fetch = (params={})=>{
    this.setState({ loading: true });
    axios.get('/api/lottery/list', {
      ...params
    }).then((res) => {
      if (res.status === 200 && res.data.code===0) {
        const data = res.data.data;
        const pagination = { ...this.state.pagination };
        pagination.total = data.rowCnt; // 总数量
        this.setState({
          loading: false,
          data: data.dataList,
          pagination
        })
      }
    })
  }
  componentDidMount(){
    this.fetch();
  }
  render() { 
    return (
      <div>lottery
        <Table columns={columns} 
          dataSource={this.state.data} 
          rowKey={record => record.id}
          pagination={this.state.pagination}
          scroll={{ y: 600 }}
        />
      </div>
    );
  }
}
 
export default Lottery;