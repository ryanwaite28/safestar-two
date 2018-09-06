import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as client from '../../utils/http_request'
import * as tools from '../../utils/tools'

import NavBar from '../NavBar';
import PageComponent from '../PageComponent';



class AccountPage extends PageComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loading: false
    }
  }

  update_icon() {
    this.setState({loading: true}, () => {
      let file = document.getElementById('icon-input').files[0];
      let form_data = new FormData();
      form_data.append('icon_image', file);
      client.update_icon(form_data)
      .then(resp => {
        this.setState({loading: false}, () => {
          if(resp.error) { return window.alert(resp.message); }
          document.getElementById('icon-input').value = "";
          document.getElementById('icon-input-text').value = "";
          this.setState({ user: resp.user }, () => { window.alert(resp.msg); });
        });
      })
    });
  }

  componentDidMount() {
    client.check_session()
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
            <div className="col s12 m5 l4">
              <div className="card-panel ovf-h">
                { this.state.user.fname &&
                  <h4 className="text-center">Hi {tools.capitalize(this.state.user.fname || "")} {this.state.user.mname[0].toUpperCase() + "."} {tools.capitalize(this.state.user.lname || "")}!</h4>
                }
                { this.state.user.icon &&
                  <img id="account-icon" className="polaroid" alt={tools.capitalize(this.state.user.fname) + " " + this.state.user.mname[0].toUpperCase() + ". " + tools.capitalize(this.state.user.lname)} src={this.state.user.icon}/>
                }
              </div>
              <div className="card-panel ovf-h">
                <form action="#">
                  <h5 className="text-center">Update Icon</h5>
                  <br/>
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>File</span>
                      <input id="icon-input" type="file" accept="image/*"/>
                    </div>
                    <div className="file-path-wrapper">
                      <input id="icon-input-text" className="file-path validate" type="text"/>
                    </div>
                    <br/>
                    <a disabled={this.state.loading} onClick={() => { this.update_icon() }} className="waves-effect waves-light btn">Submit</a>
                  </div>
                </form>
              </div>
            </div>

            <div className="col s12 m7 l8">
            <div className="card-panel ovf-h">
              <h5 className="text-center">Notifications</h5>
              <br/>

            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountPage;
