$(document).ready(function(){

  let new_user_field_name = $('#new_user_field_name');
  let new_user_field_value = $('#new_user_field_value');
  let user_fields_count = $('#user_fields_count');
  let user_fields_list = $('#user_fields_list');
  let first_name_span = $('#first_name_span');
  let middle_name_span = $('#middle_name_span');
  let last_name_span = $('#last_name_span');

  let session;
  let user_fields = {};

  let init_promises = [
    client.check_session(),
    client.get_user_fields()
  ];

  Promise.all(init_promises)
  .then(values => {
    let session = values[0];
    first_name_span.text(tools.capitalize(session.user.fname));
    middle_name_span.text(tools.capitalize(session.user.mname));
    last_name_span.text(tools.capitalize(session.user.lname));
    tools.array_sort_by(values[1].user_fields, "id", "desc").forEach(field => {
      user_fields[field.unique_value] = field;
      user_fields_list.append($(field.dom));
    });
    user_fields_count.text(Object.keys(user_fields).length);
    console.log(values, user_fields);
  })
  .catch(error => {
    console.log('error', error);
  })

  /* --- */

  function toggle_edit_box_view(e) {
    let unique_value = $(this).data('user_field_unique_value');
    let selector = '#' + 'edit_user_field_box_' + unique_value;
    $(selector).toggleClass("ghost-1");
  }



  function add_user_field() {
    let user_field_name = new_user_field_name.val();
    let user_field_value = new_user_field_value.val();
    tools.setActionButtonsDisabledState(true);
    client.add_user_field({ user_field_name, user_field_value })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }
      user_fields[resp.new_user_field.unique_value] = resp.new_user_field;
      user_fields_list.prepend($(resp.new_user_field.dom));
      new_user_field_name.val('');
      new_user_field_value.val('');
      user_fields_count.text(Object.keys(user_fields).length);
    })
  }

  function edit_user_field(e) {
    let unique_value = $(this).data('user_field_unique_value');
    let field = user_fields[unique_value];
    if(!field) { return; }

    let edit_fieldname_selector = '#' + 'edit_user_field_name_input_' + unique_value;
    let edit_fieldvalue_selector = '#' + 'edit_user_field_value_input_' + unique_value;

    let name = $(edit_fieldname_selector).val();
    let value = $(edit_fieldvalue_selector).val();

    tools.setActionButtonsDisabledState(true);
    client.edit_user_field({ user_field_name: name, user_field_value: value, user_field_id: field.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'user_field_' + unique_value;
      let old_dom = $(old_dom_selector);
      let new_dom = $(resp.user_field.dom);
      old_dom.replaceWith(new_dom);
      user_fields[unique_value] = resp.user_field;
      user_fields_count.text(Object.keys(user_fields).length);
    })
  }

  function delete_user_field(e) {
    let unique_value = $(this).data('user_field_unique_value');
    let field = user_fields[unique_value];
    if(!field) { return; }
    let ask = window.confirm('Are you sure you want to delete "' + field.name + '"?');
    if(!ask) { return; }

    tools.setActionButtonsDisabledState(true);
    client.delete_user_field({ user_field_id: field.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'user_field_' + unique_value;
      let old_dom = $(old_dom_selector);
      $(old_dom).remove();
      delete user_fields[unique_value];
      user_fields_count.text(Object.keys(user_fields).length);
    })
  }

  $(document).on('click', 'a#submit_new_user_field_btn', add_user_field);
  $(document).on('click', 'a.edit_user_field_btn', toggle_edit_box_view);
  $(document).on('click', 'a.delete_user_field_btn', delete_user_field);
  $(document).on('click', 'a.submit_edits_user_field_btn', edit_user_field);

});
