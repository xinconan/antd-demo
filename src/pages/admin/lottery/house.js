import React, { PureComponent } from 'react';
import {Button, DatePicker, Form, Card, Input, InputNumber} from 'antd';
import moment from 'moment'
import utils from '../../../utils';
import ajax from '../../../ajax';

const FormItem = Form.Item;
class CreateHouse extends PureComponent{
  constructor(props){
    super(props);
    this.id = this.props.match.params.houseId;
  }
  componentDidMount(){
    ajax({
      method: 'get',
      url: '/api/lottery/dbHouseInfo',
      data: {id: this.id}
    }).then(resp=>{
      const data = resp.data;
      if(data) {
        this.props.form.setFieldsValue({
          // ...data, 使用这个需要剔除form表单中不存在的字段
          house_name: data.house_name,
          alias: data.alias,
          homeless_number: data.homeless_number,
          total_people: data.total_people,
          homeless_people: data.homeless_people,
          house_number: data.house_number,
          lottery_time: moment(data.lottery_time)
        })
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(values.lottery_time) {
          values.lottery_time = moment(values.lottery_time).format('YYYY-MM-DD HH:mm:ss');
        }
        values.id = this.id;
        ajax({
          url: '/api/sync/houseInfo',
          data: values
        }).then(resp=>{
          if(resp.code === 0) {
            utils.success('修改成功');
          }
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
       <div className="x-bg">
        <Card title="楼盘详情">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="楼盘名称"
            >
              {getFieldDecorator('house_name', {
                rules: [{
                  required: true, message: '请输入楼盘名称',
                }],
              })(
                <Input placeholder="请输入楼盘名称"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="楼盘别名（推广名）"
            >
              {getFieldDecorator('alias')(
                <Input placeholder="请输入楼盘别名"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="摇号时间"
            >
              {getFieldDecorator('lottery_time', {
                rules: [{
                  required: true, message: '请输入摇号时间',
                }],
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="无房家庭套数"
            >
              {getFieldDecorator('homeless_number', {
                rules: [{
                  type: 'number', message: '只能是正整数',min:0
                }],
              })(
                <InputNumber/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="可售套数"
            >
              {getFieldDecorator('house_number', {
                rules: [{
                  type: 'number', message: '只能是正整数',min:0
                }],
              })(
                <InputNumber/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="报名人数"
            >
              {getFieldDecorator('total_people', {
                rules: [{
                  type: 'number', message: '只能是正整数',min:0
                }],
              })(
                <InputNumber/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="无房家庭报名人数"
            >
              {getFieldDecorator('homeless_people', {
                rules: [{
                  type: 'number', message: '只能是正整数',min:0
                }],
              })(
                <InputNumber/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
            </FormItem>
          </Form>
        </Card>
       </div>
    );
  }
}

export default Form.create()(CreateHouse);
