import React, { Component } from 'react';

import {
  store,
  user_state_change
} from '../../store';

import * as client from '../../utils/http_request'

import NavBar from '../NavBar';



class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      mname: "",
      lname: "",
      email: "",
      password: "",
      password_verify: "",
      loading: true
    }
  }

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

  sign_up() {
    let ask = window.confirm('Are all fields corrects?');
    if(!ask) { return; }
    this.setState({loading: true}, () => {
      client.sign_up(this.state)
      .then(resp => {
        console.log(resp);
        this.setState({loading: false}, () => {
          if(resp.error) {
            window.alert(resp.message);
            return;
          }
          user_state_change(resp.user);
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
                <h4 className="text-center">Sign Up</h4>
                <br/>
                <form className="col s12">
                <div className="row">
                <div className="input-field col s4">
                  <input placeholder="First Name" id="fname" type="text" className="validate" value={this.state.fname} onChange={(e) => { this.setState({ fname: e.target.value }) }} />
                </div>
                <div className="input-field col s4">
                  <input placeholder="Middle Name" id="mname" type="text" className="validate" value={this.state.mname} onChange={(e) => { this.setState({ mname: e.target.value }) }} />
                </div>
                <div className="input-field col s4">
                  <input placeholder="Last Name" id="lname" type="text" className="validate" value={this.state.lname} onChange={(e) => { this.setState({ lname: e.target.value }) }} />
                </div>
                </div>
                <div className="row">
                <div className="input-field col s12">
                  <input placeholder="Email" id="email" type="email" className="validate" value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }) }} />
                </div>
                <div className="input-field col s6">
                  <input placeholder="Password" id="password" type="password" className="validate" value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }} />
                </div>
                <div className="input-field col s6">
                  <input placeholder="Verify Password" id="password_verify" type="password" className="validate" value={this.state.password_verify} onChange={(e) => { this.setState({ password_verify: e.target.value }) }} />
                </div>
                <a disabled={this.state.loading} onClick={() => { this.sign_up() }} className="waves-effect waves-light btn">Submit</a>
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

export default SignupPage;
