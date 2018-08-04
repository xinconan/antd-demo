import React from 'react';
import {Menu, Icon} from 'antd';
import {NavLink, withRouter} from 'react-router-dom';
import MenuList from '../../config/menu';
const SubMenu = Menu.SubMenu;
// 获取react-router提供的props
@withRouter
class NavLeft extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      current: this.props.location.pathname
    }
  }
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
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }
  render(){
    const menuNode = this.renderMenuNode(MenuList);
    // console.log(this.props)
    const {pathname} = this.props.location;
    // 保障子菜单一开始就显示，并展开父菜单
    // 取路由前2 /admin/lottery/list  -> /admin/lottery
    const path = pathname.split('/').slice(0,3).join('/');
    return (
      <Menu theme="dark" mode="inline" 
        defaultOpenKeys={[path]}
        selectedKeys={[this.state.current]}
        onClick={this.handleClick}
        >
        {menuNode}
      </Menu>
    )
  }
}

export default NavLeft;
