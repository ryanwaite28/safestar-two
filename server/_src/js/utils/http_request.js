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
  Client.get_user_assets = function get_user_assets() {
    return send_request("/get_user_assets", "GET", null, null);
  }
  Client.get_user_asset = function get_user_asset(asset_unique_value) {
    return send_request("/get_user_asset/" + asset_unique_value, "GET", null, null);
  }
  Client.get_asset_fields = function get_asset_fields(asset_id) {
    return send_request("/get_asset_fields/" + asset_id, "GET", null, null);
  }
  Client.get_entity_fields = function get_user_fields(entity_unique_value) {
    return send_request("/get_entity_fields" + entity_unique_value, "GET", null, null);
  }
  Client.get_user_entities = function get_user_entities() {
    return send_request("/get_user_entities", "GET", null, null);
  }
  Client.get_user_entity = function get_user_entity(entity_unique_value) {
    return send_request("/get_user_entity/" + entity_unique_value, "GET", null, null);
  }
  Client.get_entity_fields = function get_entity_fields(entity_id) {
    return send_request("/get_entity_fields/" + entity_id, "GET", null, null);
  }


  Client.sign_up = function sign_up(data) {
    return send_request("/sign_up", "POST", data, null);
  }
  Client.sign_in = function sign_in(data) {
    return send_request("/sign_in", "PUT", data, null);
  }
  Client.sign_out = function sign_out() {
    return send_request("/sign_out", "PUT", null, null);
  }

  Client.update_icon = function update_icon(form_data) {
    return send_request("/update_icon", "PUT", form_data, null);
  }
  Client.change_user_password = function change_user_password(data) {
    return send_request("/change_user_password", "PUT", data, null);
  }

  Client.add_user_field = function add_user_field(data) {
    return send_request("/add_user_field", "POST", data, null);
  }
  Client.edit_user_field = function edit_user_field(data) {
    return send_request("/edit_user_field", "PUT", data, null);
  }
  Client.delete_user_field = function delete_user_field(data) {
    return send_request("/delete_user_field", "DELETE", data, null);
  }

  Client.add_user_asset = function add_user_asset(data) {
    return send_request("/add_user_asset", "POST", data, null);
  }
  Client.edit_user_asset = function edit_user_asset(data) {
    return send_request("/edit_user_asset", "PUT", data, null);
  }
  Client.delete_user_asset = function delete_user_asset(data) {
    return send_request("/delete_user_asset", "DELETE", data, null);
  }

  Client.add_user_entity = function add_user_entity(data) {
    return send_request("/add_user_entity", "POST", data, null);
  }
  Client.edit_user_entity = function edit_user_entity(data) {
    return send_request("/edit_user_entity", "PUT", data, null);
  }
  Client.delete_user_entity = function delete_user_entity(data) {
    return send_request("/delete_user_entity", "DELETE", data, null);
  }

  Client.add_asset_field = function add_asset_field(data) {
    return send_request("/add_asset_field", "POST", data, null);
  }
  Client.edit_asset_field = function edit_asset_field(data) {
    return send_request("/edit_asset_field", "PUT", data, null);
  }
  Client.delete_asset_field = function delete_asset_field(data) {
    return send_request("/delete_asset_field", "DELETE", data, null);
  }

  Client.add_entity_field = function add_entity_field(data) {
    return send_request("/add_entity_field", "POST", data, null);
  }
  Client.edit_entity_field = function edit_entity_field(data) {
    return send_request("/edit_entity_field", "PUT", data, null);
  }
  Client.delete_entity_field = function delete_entity_field(data) {
    return send_request("/delete_entity_field", "DELETE", data, null);
  }

  /* --- */





  /* --- */

  return Client;
})();

Object.freeze(client);
