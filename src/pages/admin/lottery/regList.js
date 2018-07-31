// 摇号列表
import React, { Component } from 'react';
import axios from 'axios';
import {Breadcrumb, Divider, Table} from 'antd';
import {NavLink} from 'react-router-dom';

class RegList extends Component {
  constructor(props){
    super(props);
    this.state={
      data: [], // 列表值
      list: {}, // 总列表，本地缓存
      pagination: {
        defaultPageSize: 20
      },
      houseId: this.props.match.params.houseId
    };
    this.columns = [{
      title: '登记号',
      dataIndex: 'serial_number',
      width: 120,
    }, {
      title: '购房人姓名',
      dataIndex: 'buyers_name',
      width: 150,
    }, {
      title: '购房人证件号码',
      dataIndex: 'buyers_idnumber',
      width: 200,
    }, {
      title: '查档编号',
      dataIndex: 'record_number',
      width: 200,
    }, {
      title: '是否无房家庭',
      dataIndex: 'is_homeless',
      width: 150,
      render: text => (
        <span>
          {text===1?'是':'否'}
        </span>
      )
    },{
      title: '其他购房人及家庭成员',
      dataIndex: 'other_buyers_name',
      width: 200,
    },{
      title: '其他购房人及家庭成员证件号码',
      dataIndex: 'other_buyers_idnumber',
      render: text => (
        <span>
          {
            text.split(',').map(v=>(
              <p key={v}>{v}</p>
            ))
          }
        </span>
      )
    }];
  }
  componentDidMount(){
    this.fetch();
  }
  // 请求不同页面数据
  handleTableChange = (pagination) => {
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
      pageNum: pagination.current
    });
  }
  fetch = (params={pageNum:1})=>{
    this.setState({ loading: true });
    axios.post('/api/lottery/regList', {
      houseId: this.state.houseId,
      ...params
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
  render() { 
    return (
      <div className="x-bg">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <NavLink to="/admin/lottery/list">摇号信息</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>登记表</Breadcrumb.Item>
        </Breadcrumb>
        <Divider />
        <Table columns={this.columns} 
          dataSource={this.state.data} 
          rowKey={record => record.id}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          loading={this.state.loading}
          scroll={{ y: 600 }}
        />
      </div>
    );
  }
}
 
export default RegList;