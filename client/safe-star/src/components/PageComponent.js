import React, { Component } from 'react';

import {
  store,
  user_state_change
} from '../store';

import * as client from '../utils/http_request';



class PageComponent extends Component {
  session = {}

  getSession() {
    return this.session;
  }

  constructor(props) {
    super(props);
  }

  sign_out() {
    client.sign_out()
    .then(resp => {
      console.log(resp);
      window.location.href = '/';
    })
  }

  check_session() {
    return client.check_session();
  }

  componentWillMount() {
    // this.check_session().then(resp => { this.session = resp; });
  }
}

export default PageComponent;
