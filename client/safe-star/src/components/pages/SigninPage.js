import React, { Component } from 'react';

import {
  store,
  user_state_change
} from '../../store'

import * as client from '../../utils/http_request'

import NavBar from '../NavBar';



class SigninPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: true
    }
  }

  user = {}

  componentDidMount() {
    client.check_session()
    .then(resp => {
      this.setState({loading: false}, () => {
        if(resp.online === true) {
          return this.props.history.push("/account");
        }
      });
    })
  }

  sign_in() {
    this.setState({loading: true}, () => {
      client.sign_in(this.state)
      .then(resp => {
        this.setState({loading: false}, () => {
          if(resp.error) {
            window.alert(resp.message);
            return;
          }
          this.user = resp.user;
          this.props.history.push("/account");
        });
      });
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
                <h4 className="text-center">Sign In</h4>
                <br/>
                <form className="col s12">
                  <div className="row">
                  <div className="input-field col s12">
                    <input placeholder="Email" id="email" type="text" className="validate" value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }) }} />
                  </div>
                  <div className="input-field col s12">
                    <input placeholder="Password" id="password" type="password" className="validate" value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }} />
                  </div>
                  <a disabled={this.state.loading} onClick={() => { this.sign_in() }} className="waves-effect waves-light btn">Submit</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SigninPage;
