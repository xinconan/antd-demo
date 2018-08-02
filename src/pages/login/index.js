import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Logo from '../../logo.svg';
import './index.scss';

const FormItem = Form.Item;

class Login extends React.Component{
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-wrapper">
        <header>
          <a>
            <img src={Logo} alt="Logo"/>
            <span className="title">Ant Design Demo</span>
          </a>
        </header>
        <div className="login-form-wrapper">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              <a className="login-form-forgot" href="">忘记密码</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
              或者 <a href="">立即注册</a>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Login);;
