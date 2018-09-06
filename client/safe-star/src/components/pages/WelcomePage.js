import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  store,
  user_state_change
} from '../../store'
import * as client from '../../utils/http_request'

import NavBar from '../NavBar';


class WelcomePage extends Component {
  componentDidMount() {
    client.check_session()
    .then(resp => {
      if(resp.online === true) {
        return this.props.history.push("/account");
      }
    })
  }

  render() {
    return (
      <div className="">
        <NavBar user={this.user || {}} sign_out={this.sign_out || null} />

        <div className="container">
          <div className="row">
            <div className="col m12">
              <div className="card-panel ovf-h">
                <h4 className="text-center">Welcome!</h4>
                <br/>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomePage;
