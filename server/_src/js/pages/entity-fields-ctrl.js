$(document).ready(function(){

  let splitter = location.pathname.split('/');
  let entity_unique_value = splitter[splitter.length -1];

  let new_entity_field_name = $('#new_entity_field_name');
  let new_entity_field_value = $('#new_entity_field_value');
  let entity_fields_count = $('#entity_fields_count');
  let entity_fields_list = $('#entity_fields_list');
  let entity_name_heading = $('#entity_name_heading');

  let session;
  let entity;
  let entity_fields = {};

  client.check_session()
  .then(session_obj => {
    session = session_obj;
    return client.get_user_entity(entity_unique_value);
  })
  .then(res => {
    entity = res.user_entity;
    entity_name_heading.text(entity.name);
    return client.get_entity_fields(entity.id)
  })
  .then(resp => {
    console.log(session, entity, resp);
    tools.array_sort_by(resp.entity_fields, "id", "desc").forEach(field => {
      entity_fields[field.unique_value] = field;
      entity_fields_list.append($(field.dom));
    });
    entity_fields_count.text(Object.keys(entity_fields).length);
  })
  .catch(error => {
    console.log('error', error);
  })

  /* --- */

  function toggle_edit_box_view(e) {
    let unique_value = $(this).data('entity_field_unique_value');
    let selector = '#' + 'edit_entity_field_box_' + unique_value;
    $(selector).toggleClass("ghost-1");
  }



  function add_entity_field() {
    let entity_field_name = new_entity_field_name.val();
    let entity_field_value = new_entity_field_value.val();
    tools.setActionButtonsDisabledState(true);
    client.add_entity_field({ entity_field_name, entity_field_value, entity_id: entity.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }
      entity_fields[resp.new_entity_field.unique_value] = resp.new_entity_field;
      entity_fields_list.prepend($(resp.new_entity_field.dom));
      new_entity_field_name.val('');
      new_entity_field_value.val('');
      entity_fields_count.text(Object.keys(entity_fields).length);
    })
  }

  function edit_entity_field(e) {
    let unique_value = $(this).data('entity_field_unique_value');
    let field = entity_fields[unique_value];
    if(!field) { return; }

    let edit_fieldname_selector = '#' + 'edit_entity_field_name_input_' + unique_value;
    let edit_fieldvalue_selector = '#' + 'edit_entity_field_value_input_' + unique_value;

    let name = $(edit_fieldname_selector).val();
    let value = $(edit_fieldvalue_selector).val();

    tools.setActionButtonsDisabledState(true);
    client.edit_entity_field({ entity_field_name: name, entity_field_value: value, entity_field_id: field.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'entity_field_' + unique_value;
      let old_dom = $(old_dom_selector);
      let new_dom = $(resp.entity_field.dom);
      old_dom.replaceWith(new_dom);
      entity_fields[unique_value] = resp.entity_field;
      entity_fields_count.text(Object.keys(entity_fields).length);
    })
  }

  function delete_entity_field(e) {
    let unique_value = $(this).data('entity_field_unique_value');
    let field = entity_fields[unique_value];
    if(!field) { return; }
    let ask = window.confirm('Are you sure you want to delete "' + field.name + '"?');
    if(!ask) { return; }

    tools.setActionButtonsDisabledState(true);
    client.delete_entity_field({ entity_field_id: field.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'entity_field_' + unique_value;
      let old_dom = $(old_dom_selector);
      $(old_dom).remove();
      delete entity_fields[unique_value];
      entity_fields_count.text(Object.keys(entity_fields).length);
    })
  }

  $(document).on('click', 'a#submit_new_entity_field_btn', add_entity_field);
  $(document).on('click', 'a.edit_entity_field_btn', toggle_edit_box_view);
  $(document).on('click', 'a.delete_entity_field_btn', delete_entity_field);
  $(document).on('click', 'a.submit_edits_entity_field_btn', edit_entity_field);

});
