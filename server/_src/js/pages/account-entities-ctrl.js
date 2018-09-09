$(document).ready(function(){

  let new_user_entity_name = $('#new_user_entity_name');

  let user_entities_count = $('#user_entities_count');
  let user_entities_list = $('#user_entities_list');
  let first_name_span = $('#first_name_span');
  let middle_name_span = $('#middle_name_span');
  let last_name_span = $('#last_name_span');

  let session;
  let user_entities = {};

  let init_promises = [
    client.check_session(),
    client.get_user_entities()
  ];

  Promise.all(init_promises)
  .then(values => {
    let session = values[0];
    first_name_span.text(tools.capitalize(session.user.fname));
    middle_name_span.text(tools.capitalize(session.user.mname));
    last_name_span.text(tools.capitalize(session.user.lname));
    tools.array_sort_by(values[1].user_entities, "id", "desc").forEach(entity => {
      user_entities[entity.unique_value] = entity;
      user_entities_list.append($(entity.dom));
    });
    user_entities_count.text(Object.keys(user_entities).length);
    console.log(values, user_entities);
  })
  .catch(error => {
    console.log('error', error);
  })

  /* --- */

  function toggle_edit_box_view(e) {
    let unique_value = $(this).data('user_entity_unique_value');
    let selector = '#' + 'edit_user_entity_box_' + unique_value;
    $(selector).toggleClass("ghost-1");
  }



  function add_user_entity() {
    let entity_name = new_user_entity_name.val();
    tools.setActionButtonsDisabledState(true);
    client.add_user_entity({ entity_name })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }
      user_entities[resp.new_user_entity.unique_value] = resp.new_user_entity;
      user_entities_list.prepend($(resp.new_user_entity.dom));
      new_user_entity_name.val('');
      user_entities_count.text(Object.keys(user_entities).length);
    })
  }

  function edit_user_entity(e) {
    let unique_value = $(this).data('user_entity_unique_value');
    let entity = user_entities[unique_value];
    if(!entity) { return; }

    let edit_entityname_selector = '#' + 'edit_user_entity_name_input_' + unique_value;
    let edit_entityvalue_selector = '#' + 'edit_user_entity_value_input_' + unique_value;

    let entity_name = $(edit_entityname_selector).val();
    let value = $(edit_entityvalue_selector).val();

    tools.setActionButtonsDisabledState(true);
    client.edit_user_entity({ entity_name, entity_id: entity.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'user_entity_' + unique_value;
      let old_dom = $(old_dom_selector);
      let new_dom = $(resp.user_entity.dom);
      old_dom.replaceWith(new_dom);
      user_entities[unique_value] = resp.user_entity;
      user_entities_count.text(Object.keys(user_entities).length);
    })
  }

  function delete_user_entity(e) {
    let unique_value = $(this).data('user_entity_unique_value');
    let entity = user_entities[unique_value];
    if(!entity) { return; }

    let ask = window.confirm('Are you sure you want to delete "' + entity.name + '"?');
    if(!ask) { return; }

    tools.setActionButtonsDisabledState(true);
    client.delete_user_entity({ entity_id: entity.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'user_entity_' + unique_value;
      let old_dom = $(old_dom_selector);
      $(old_dom).remove();
      delete user_entities[unique_value];
      user_entities_count.text(Object.keys(user_entities).length);
    })
  }

  $(document).on('click', 'a#submit_new_user_entity_btn', add_user_entity);
  $(document).on('click', 'a.edit_user_entity_btn', toggle_edit_box_view);
  $(document).on('click', 'a.delete_user_entity_btn', delete_user_entity);
  $(document).on('click', 'a.submit_edits_user_entity_btn', edit_user_entity);

});
