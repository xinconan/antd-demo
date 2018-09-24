import React, { Component } from 'react';
import { Button, Card, Form, Input, InputNumber, message, Modal, Table, Progress } from 'antd';
import axios from 'axios';
import ajax from '../../../ajax'
import {NavLink} from 'react-router-dom';
import io from 'socket.io-client'
const socket = io()

const FormItem = Form.Item;
const editStyle = { marginRight: 10 };

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [], // 列表值
      list: {}, // 总列表，本地缓存
      pagination: {
        defaultPageSize: 20
      },
      editingKey: '',
      houseInfo: {},
      loading: true,
      showModal: false,
      showProgress: false, // 进度条
    };
    this.columns = [{
      title: '摇号楼盘',
      dataIndex: 'house_name',
      editable: true,
    }, {
      title: '推广名',
      dataIndex: 'alias',
      width: 120,
      editable: true,
    }, {
      title: '申购家庭登记总数',
      dataIndex: 'total_people',
      width: 100,
      editable: true,
    }, {
      title: '申购无房家庭总数',
      dataIndex: 'homeless_people',
      width: 100,
      editable: true,
    }, {
      title: '可售房源套数',
      dataIndex: 'house_number',
      width: 100,
      editable: true,
    }, {
      title: '无房家庭套数',
      dataIndex: 'homeless_number',
      width: 100,
      editable: true,
    },{
      title: '摇号时间',
      dataIndex: 'lottery_time',
      width: 100,
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: text => (
        <span>
          {text===1?'已摇号':'待摇号'}
        </span>
      )
    },{
      title: '操作',
      dataIndex: 'id',
      width: 200,
      render: (text,record)=>{
        const editable = this.isEditing(record);
        return <span>
          {editable?(
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.id)}
                    style={editStyle}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <a onClick={() => this.cancel(record.id)} style={editStyle}>取消</a>
            </span>
            ) : (
              <a onClick={() => this.edit(record.id)} style={editStyle}>修改</a>
            )

          }
          {record.reg_sync===0&&
          <Button type="primary" className="x-mgr" onClick={()=>this.syncRegList(text)}>同步报名表</Button>}
          {// 已经摇号的才能同步
            record.status === 1&& record.result_sync === 0 && 
          <Button type="primary" className="x-mgr" icon="sync" onClick={()=>this.syncResultList(text)}>同步结果</Button>
          }
          <NavLink to={`/admin/lottery/regList/${text}`}>报名表</NavLink>
        </span>
      }
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
    const pageNum = pager.current - 1;  // local db from 0 start
    // 如果当前页面数据请求过，不走服务器
    if(this.state.list[pageNum]) {
      this.setState({
        data: this.state.list[pageNum]
      });
      return;
    }
    this.fetch({
      pageNum, 
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
    }else{
      message.error(status.msg || status.error);
    }
  }
  // sync 同步登记结果
  async syncResultList(houseId){
    let status = await axios.get('/api/sync/isRegSync', {
      params: {id: houseId}
    });
    // status = status.data;
    if(status.code === 0) {
      if(status.data.reg_sync !== 1) {
        message.error('请先同步报名表！');
      }else if(status.data.result_sync === 1){
        message.info('该信息已同步！');
      }else {
        socket.emit('task', {houseId, type: 'result'})
      }
    }else{
      message.error(status.msg || status.error);
    }
  }
  fetch = (params={pageNum:0})=>{
    this.setState({ loading: true });
    ajax({
      url: '/api/lottery/houseList',
      method: 'get',
      data: params
    }).then((res) => {
      if(res.code === -1) return;
      const data = res.data;
      const pagination = { ...this.state.pagination };
      const list = { ...this.state.list };
      pagination.total = data.total; // 总数量
      list[params.pageNum] = data.list; // 缓存
      this.setState({
        loading: false,
        data: data.list,
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
  syncHouse(houseInfo, showMsg=false){
    axios.post('/api/sync/houseInfo', houseInfo)
    .then(resp => {
      if(!showMsg) return;
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
  isEditing = (record) => {
    return record.id === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item = newData[index];
        const newItem = {
          ...item,
          ...row,
        }
        this.syncHouse(newItem);
        newData.splice(index, 1, newItem);
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  render() { 
    const {houseInfo} = this.state;
    const { getFieldDecorator } = this.props.form;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div className="x-bg">
        <Card style={{marginBottom: '20px'}}>
          <Form
            layout="inline"
            onSubmit={this.handleSearch}
          >
            <FormItem
              label="楼盘名"
            >
              {getFieldDecorator('userName')(
                <Input placeholder="请输入楼盘名或推广名" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">搜索</Button>
            </FormItem>
              
          </Form>
        </Card>
        <Table columns={columns} 
          components={components}
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
              <Button type="primary" onClick={()=>this.syncHouse(houseInfo, true)}>同步</Button>
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
 
export default Form.create()(Search);