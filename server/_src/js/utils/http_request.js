const client = (function(){
  let Client = {};

  /* --- */

  function send_request(route, method, data, content_type) {
    let obj = {
      method: method || "GET",
      credentials: "include"
    }
    if(data) {
      if(data.constructor === Object) {
        obj.body = JSON.stringify(data);
        obj.headers = {};
        obj.headers["Content-Type"] = content_type || "application/json";
        obj.headers["Accept"] = "application/json";
      }
      if(data.constructor === FormData) {
        obj.body = data;
      }
    }
    return fetch(route, obj).then(function(resp){ return resp.json() });
  }



  Client.send_request = send_request;

  Client.test_route = function test_route() {
    return send_request("/test_route", "GET", null, null);
  }

  Client.check_session = function check_session() {
    return send_request("/check_session", "GET", null, null);
  }

  Client.get_user_fields = function get_user_fields() {
    return send_request("/get_user_fields", "GET", null, null);
  }



  Client.sign_up = function sign_up(data) {
    return send_request("/sign_up", "POST", data, null);
  }

  Client.sign_in = function sign_in(data) {
    return send_request("/sign_in", "POST", data, null);
  }

  Client.sign_out = function sign_out() {
    return send_request("/sign_out", "POST", null, null);
  }

  Client.update_icon = function update_icon(form_data) {
    return send_request("/update_icon", "POST", form_data, null);
  }

  Client.add_user_field = function add_user_field(data) {
    return send_request("/add_user_field", "POST", data, null);
  }

  Client.edit_user_field = function edit_user_field(data) {
    return send_request("/edit_user_field", "POST", data, null);
  }

  Client.delete_user_field = function delete_user_field(data) {
    return send_request("/delete_user_field", "POST", data, null);
  }

  Client.add_asset = function add_asset(data) {
    return add_asset("/add_asset", "POST", data, null);
  }

  Client.add_asset_field = function add_asset_field(data) {
    return send_request("/add_asset_field", "POST", data, null);
  }

  Client.edit_asset_field = function edit_asset_field(data) {
    return send_request("/edit_asset_field", "POST", data, null);
  }

  Client.delete_asset_field = function delete_asset_field(data) {
    return send_request("/delete_asset_field", "POST", data, null);
  }

  /* --- */

  return Client;
})();

Object.freeze(client);
