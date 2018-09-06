import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  store,
  user_field_added,
  user_field_edited,
  user_field_deleted
} from '../../store';

import * as client from '../../utils/http_request'
import * as tools from '../../utils/tools'

import NavBar from '../NavBar';
import PageComponent from '../PageComponent';
import InfoField from '../InfoField';



class AccountInfoPage extends PageComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {},
      new_user_field_name: "",
      new_user_field_value: ""
    }
    this.edit_user_field = this.edit_user_field.bind(this);
    this.delete_user_field = this.delete_user_field.bind(this);
  }

  add_user_field() {
    this.setState({loading: true}, () => {
      client.add_user_field({ user_field_name: this.state.new_user_field_name, user_field_value: this.state.new_user_field_value })
      .then(resp => {
        this.setState({loading: false}, () => {
          if(resp.error) { return window.M.toast({html: resp.message}); }
          window.M.toast({html: resp.msg});
          user_field_added(resp.new_user_field);
          this.setState({ new_user_field_name: "", new_user_field_value: "" });
        });
      })
    });
  }

  edit_user_field(user_field) {
    user_field_edited(user_field);
    this.forceUpdate();
  }

  delete_user_field(user_field) {
    user_field_deleted(user_field);
    this.forceUpdate();
  }

  componentDidMount() {
    this.check_session()
    .then(resp => {
      if(resp.online === false) {
        return this.props.history.push("/signin");
      }
      let user = resp.user;
      client.get_user_fields()
      .then(res => {
        res.user_fields.forEach(user_field => {
          user_field_added(user_field);
        });
        this.setState({ loading: false, user });
      });
    })
  }

  render() {
    let { user_fields } = store.getState();
    console.log(user_fields);
    return (
      <div className="">
        <NavBar user={this.state.user || {}} sign_out={this.sign_out || null} />

        <div className="container">
          <div className="row">
            <div className="col m12">
              <div className="card">
                <div className="card-content ovf-h">
                  <h4 className="text-center">Your Information!</h4>
                  <p className="text-center">{Object.keys(user_fields).length} Field(s)</p>
                </div>
                <div className="card-action">
                  <h6 className="text-center">Add New Field</h6>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input placeholder="New Name" id="new_name" type="text" className="validate" value={this.state.new_user_field_name} onChange={(e) => { this.setState({ new_user_field_name: e.target.value }) }} />
                    </div>
                    <div className="input-field col s12 m6">
                      <input placeholder="New Value" id="new_value" type="text" className="validate" value={this.state.new_user_field_value} onChange={(e) => { this.setState({ new_user_field_value: e.target.value }) }} />
                    </div>
                    <a disabled={this.state.loading} onClick={() => { this.add_user_field() }} className="waves-effect waves-light btn">Submit</a>
                  </div>
                </div>
                { Object.keys(user_fields).length > 0 &&
                  Object.keys(user_fields).map((key, index) => (
                    <InfoField key={index} field={user_fields[key]}
                      edit_user_field={this.edit_user_field} delete_user_field={this.delete_user_field} />
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountInfoPage;
