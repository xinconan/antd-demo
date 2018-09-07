import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/login';
import Admin from './App';
import Home from './pages/admin/home';
import NoMatch from './pages/admin/noMatch';
import Lottery from './pages/admin/lottery/list';
import RegList from './pages/admin/lottery/regList';
import createHouse from './pages/admin/lottery/createHouse';

class Router extends React.Component{
  render(){
    return (
      <BrowserRouter>
        <div>
          <Route path="/login" component={Login}/> 
          <Route path="/" exact component={Login}/> 
          <Route path="/admin" render={()=>(
            <Admin>
              <Switch>
                <Route exact path="/admin" component={Home}/>
                <Route path="/admin/home" component={Home}/>
                <Route path="/admin/lottery/list" component={Lottery}/>
                <Route path="/admin/lottery/regList/:houseId" component={RegList}/>
                <Route path="/admin/lottery/createHouse" component={createHouse}/>
                <Route component={NoMatch}/>
              </Switch>
            </Admin>
          )}/> 
        </div> 
      </BrowserRouter>
    )
  }
}

export default Router;
