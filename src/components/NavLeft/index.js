import React from 'react';
import {Menu, Icon} from 'antd';
import {NavLink} from 'react-router-dom';
import MenuList from '../../config/menu';
const SubMenu = Menu.SubMenu;

class NavLeft extends React.Component{
  // componentDidMount(){
  //   const menuNode = this.renderMenuNode(MenuList);
  //   this.setState({
  //     menuNode
  //   });
  // }
  renderMenuNode = (data)=>{
    return data.map((item) => {
      if(item.children) {
        return (
          <SubMenu title={
            <span>
              {item.icon?<Icon type={item.icon}/>: null}
              <span>{item.title}</span>
            </span>
          } key={item.key} >
            { this.renderMenuNode(item.children)}
          </SubMenu>
        )
      }else {
        return (
          <Menu.Item key={item.key}>
            <NavLink to={item.key}>
              {item.icon?<Icon type={item.icon}/>: null}
              <span>{item.title}</span>
            </NavLink>
          </Menu.Item>
        )
      }
    })
  }
  render(){
    const menuNode = this.renderMenuNode(MenuList);
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['/admin/home']}>
        {menuNode}
      </Menu>
    )
  }
}

export default NavLeft;
