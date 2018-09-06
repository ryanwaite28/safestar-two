import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  store
} from '../store'

import * as client from '../utils/http_request'



class NavBar extends Component {
  render() {
    const user = this.props.user;
    return (
      <div>
        <nav>
          <div className="nav-wrapper red" style={{paddingLeft: "15px"}}>
            <Link to={user.id ? "/account" : "/"} className="brand-logo">SafeStar</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            { !user.id &&
              <ul className="right hide-on-med-and-down">
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
              </ul>
            }
            { user.id &&
              <ul className="right hide-on-med-and-down">
                <li><Link to="/account/info">Info</Link></li>
                <li><Link to="/account/assets">Assets</Link></li>
                <li><a onClick={() => {if(this.props.sign_out){this.props.sign_out()}}} href="#">Sign out</a></li>
              </ul>
            }
          </div>
        </nav>

        { !user.id &&
          <ul className="sidenav" id="mobile-demo">
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        }
        { user.id &&
          <ul className="sidenav" id="mobile-demo">
            <li><Link to="/account/info">Info</Link></li>
            <li><Link to="/account/assets">Assets</Link></li>
            <li><a onClick={() => {if(this.props.sign_out){this.props.sign_out()}}} href="#">Sign out</a></li>
          </ul>
        }
        <br/><br/>
      </div>
    );
  }
}

export default NavBar;
