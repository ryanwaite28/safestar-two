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
  let url = "http://localhost:4000/main" + route;
  return fetch(url, obj).then(function(resp){ return resp.json() });
}

/* --- */

export function test_route() {
  return send_request("/test_route", "GET", null, null);
}

export function check_session() {
  return send_request("/check_session", "GET", null, null);
}

export function get_user_fields() {
  return send_request("/get_user_fields", "GET", null, null);
}



export function sign_up(data) {
  return send_request("/sign_up", "POST", data, null);
}

export function sign_in(data) {
  return send_request("/sign_in", "POST", data, null);
}

export function sign_out() {
  return send_request("/sign_out", "POST", null, null);
}

export function update_icon(form_data) {
  return send_request("/update_icon", "POST", form_data, null);
}

export function add_user_field(data) {
  return send_request("/add_user_field", "POST", data, null);
}

export function edit_user_field(data) {
  return send_request("/edit_user_field", "POST", data, null);
}

export function delete_user_field(data) {
  return send_request("/delete_user_field", "POST", data, null);
}

export function add_asset(data) {
  return add_asset("/add_asset", "POST", data, null);
}

export function add_asset_field(data) {
  return send_request("/add_asset_field", "POST", data, null);
}

export function edit_asset_field(data) {
  return send_request("/edit_asset_field", "POST", data, null);
}

export function delete_asset_field(data) {
  return send_request("/delete_asset_field", "POST", data, null);
}
