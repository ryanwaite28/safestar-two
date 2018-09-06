import React, { Component } from 'react';

// import './bootstrap4.min.css';
import './App.css';
import { Route } from 'react-router-dom'

import WelcomePage from './components/pages/WelcomePage'
import SignupPage from './components/pages/SignupPage'
import SigninPage from './components/pages/SigninPage'
import AccountPage from './components/pages/AccountPage'
import AccountInfoPage from './components/pages/AccountInfoPage'
import AccountAssetsPage from './components/pages/AccountAssetsPage'


class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={ WelcomePage }/>
        {/* --- User Paths --- */}
        <Route exact path="/signup" component={ SignupPage }/>
        <Route exact path="/signin" component={ SigninPage }/>
        <Route exact path="/account" component={ AccountPage }/>
        <Route exact path="/account/info" component={ AccountInfoPage }/>
        <Route exact path="/account/assets" component={ AccountAssetsPage } foo="bar"/>
        {/* --- Entity Paths ---
        <Route exact path="/entity/signup" component={ SignupPage }/>
        <Route exact path="/entity/signin" component={ SigninPage }/>
        <Route exact path="/entity/account" component={ AccountPage }/>
        <Route exact path="/entity/account/info" component={ AccountInfoPage }/>
        <Route exact path="/entity/account/assets" component={ AccountAssetsPage }/>
        */}
      </div>
    );
  }
}

export default App;
