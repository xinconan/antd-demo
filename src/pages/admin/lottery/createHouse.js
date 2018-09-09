import React, { PureComponent } from 'react';
import {Button, DatePicker, message, Form, Card, Input, InputNumber} from 'antd';
import axios from 'axios';
import moment from 'moment'

const FormItem = Form.Item;
class CreateHouse extends PureComponent{
  // constructor(props){
  //   super(props);
  // }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // this.props.history.push('/admin/home');
        if(values.lottery_time) {
          values.lottery_time = moment(values.lottery_time).format('YYYY-MM-DD HH:mm:ss');
        }
        axios.post('/api/lottery/addHouse', values)
        .then(resp=>{
          if (resp.status === 200 && resp.data.code===0) {
            message.success('添加成功');
          }
        })
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
        <Card title="新建楼盘（创建的楼盘保存到house_old表中，主要用来手动记录早期无法同步的楼盘）">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="楼盘名称"
            >
              {getFieldDecorator('house_name', {
                rules: [{
                  required: true, message: '请输入楼盘名字',
                }],
              })(
                <Input />
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
