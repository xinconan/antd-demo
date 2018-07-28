import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Login from './pages/login';
import Admin from './App';

class Router extends React.Component{
  render(){
    return (
      <BrowserRouter>
        <div>
          <Route path="/login" component={Login}/> 
          <Route path="/" exact component={Admin}/> 
          <Route path="/admin" component={Admin}/> 
        </div> 
      </BrowserRouter>
    )
  }
}

export default Router;
