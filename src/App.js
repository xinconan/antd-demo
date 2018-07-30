import React, { Component } from 'react';
import { Button, Layout, Icon } from 'antd';
import './App.css';
import NavLeft from './components/NavLeft'
const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      collapsed: false
    }
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const {collapsed} = this.state;
    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
        </Header>
        
        <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ overflow: 'auto', height: 'calc(100vh - 64px)', position: 'fixed', left: 0, top:'64px' }}
        >
          <NavLeft/>
        </Sider>
          <Content className={collapsed?'x-content collapsed':'x-content'} style={{ minHeight: 280,marginTop: 64 }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
