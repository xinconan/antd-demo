import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/login';
import Admin from './App';
import Home from './pages/admin/home';
import NoMatch from './pages/admin/noMatch'

class Router extends React.Component{
  render(){
    return (
      <BrowserRouter>
        <div>
          <Route path="/login" component={Login}/> 
          {/* <Route path="/" exact component={Admin}/>  */}
          <Route path="/admin" render={()=>(
            <Admin>
              {/* <Switch> */}
                <Route path="/admin" component={Home}/>
                <Route path="/admin/home" component={Home}/>
                <Route component={NoMatch}/>
              {/* </Switch> */}
            </Admin>
          )}/> 
        </div> 
      </BrowserRouter>
    )
  }
}

export default Router;
