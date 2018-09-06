import React, { Component } from 'react';


import * as client from '../utils/http_request'


class InfoField extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      loading: false,
      field_id: this.props.field.id,
      field_unique_value: this.props.field.unique_value,
      field_name: this.props.field.name,
      field_value: this.props.field.value,
    }
  }

  edit_user_field = () => {
    client.edit_user_field({ user_field_name: this.state.field_name, user_field_value: this.state.field_value, user_field_id: this.state.field_id })
    .then(resp => {
      console.log(resp);
      if(resp.error) { return window.M.toast({html: resp.message}); }
      window.M.toast({html: resp.msg});
      this.props.edit_user_field(resp.user_field);
    })
  }

  delete_user_field = () => {
    let ask = window.confirm('Are you sure you want to delete "' + this.state.field_name + '"?');
    if(!ask) { return; }
    client.delete_user_field({ user_field_id: this.state.field_id })
    .then(resp => {
      if(resp.error) { return window.M.toast({html: resp.message}); }
      window.M.toast({html: resp.msg});
      this.props.delete_user_field(this.props.field);
    })
  }

  render() {
    return (
      <div className="card-action field-bar">
        <div className="row">
          <div className="input-field col s12 m6">
            <input placeholder="Field Name" id={"field_name_" + this.state.field_id} type="text" className="validate" value={this.state.field_name} onChange={(e) => { this.setState({ field_name: e.target.value }) }} />
          </div>
          <div className="input-field col s12 m6">
            <input placeholder="Field Value" id={"field_value_" + this.state.field_id} type="text" className="validate" value={this.state.field_value} onChange={(e) => { this.setState({ field_value: e.target.value }) }} />
          </div>
          <a disabled={this.state.loading} onClick={() => { this.edit_user_field() }} className="waves-effect waves-light btn">Edit</a>
          <a disabled={this.state.loading} onClick={() => { this.delete_user_field() }} className="waves-effect waves-light btn">Delete</a>
        </div>
      </div>
    );
  }
}

export default InfoField;
