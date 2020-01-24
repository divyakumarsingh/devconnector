import React,{ Fragment,useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router,Route, Switch } from 'react-router-dom';
import Navbar from '../src/components/layout/Navbar';
import Landing from '../src/components/layout/Landing';

import { Provider } from 'react-redux';
import store from './store';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import Routes from "./components/routing/Routes";

if(localStorage.token){
    setAuthToken(localStorage.token);
}

const App=() =>{
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);
  
  return (
    <Provider store={store}>
        <Router>
            <Fragment>
                <Navbar/>
                <Switch>
                  <Route exact path='/' component={Landing}/>
                  <Routes/>
                </Switch>
            </Fragment>
        </Router>
    </Provider>
  );
}

export default App;
