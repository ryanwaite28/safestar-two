import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as client from '../../utils/http_request'
import * as tools from '../../utils/tools'

import NavBar from '../NavBar';
import PageComponent from '../PageComponent';



class AccountAssetsPage extends PageComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    this.check_session()
    .then(resp => {
      if(resp.online === false) {
        return this.props.history.push("/signin");
      }
      this.user = resp.user;
      this.setState({ user: resp.user });
    })
  }

  render() {
    return (
      <div className="">
        <NavBar user={this.state.user || {}} sign_out={this.sign_out || null} />

        <div className="container">
          <div className="row">
            <div className="col m12">
              <div className="card">
                <div className="card-content ovf-h">
                  <h4 className="text-center">Your Assets!</h4>
                </div>
                <div className="card-action">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountAssetsPage;
