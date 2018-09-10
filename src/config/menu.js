// 菜单配置
const menuList = [
  {
    title: '首页',
    key: '/admin/home',
    icon: 'home'
  },{
    title: '杭州摇号',
    key: '/admin/lottery',
    icon: 'tag',
    children: [{
      title: '摇号信息',
      key: '/admin/lottery/list',
      icon: 'bars'
    },{
      title: '摇号查询',
      key: '/admin/lottery/search',
      icon: 'search'
    },{
      title: '新建楼盘',
      key: '/admin/lottery/createHouse',
      icon: 'plus'
    }]
  },{
    title: 'DiyImg',
    key: '/admin/diyimg',
    icon: 'picture'
  },{
    title: '404页面',
    key: '/admin/not-found',
    icon: 'frown'
  }
]

export default menuList;
