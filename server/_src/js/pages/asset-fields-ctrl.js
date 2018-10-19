$(document).ready(function(){

  let splitter = location.pathname.split('/');
  let asset_unique_value = splitter[splitter.length -1];

  let new_asset_field_name = $('#new_asset_field_name');
  let new_asset_field_value = $('#new_asset_field_value');
  let asset_fields_count = $('#asset_fields_count');
  let asset_fields_list = $('#asset_fields_list');
  let asset_name_heading = $('#asset_name_heading');

  let session;
  let asset;
  let asset_fields = {};

  client.check_session()
  .then(session_obj => {
    session = session_obj;
    return client.get_user_asset(asset_unique_value);
  })
  .then(res => {
    asset = res.user_asset;
    asset_name_heading.text(asset.name);
    return Promise.all([ client.get_asset_fields_count(asset.id), client.get_asset_fields(asset.id) ]);
  })
  .then(values => {
    console.log(session, asset, values);
    tools.array_sort_by(values[1].asset_fields, "id", "desc").forEach(field => {
      asset_fields[field.unique_value] = field;
      asset_fields_list.append($(field.dom));
    });
    asset_fields_count.text(values[0].count);
    if(values[0].count === 0) { return $('a#load-more-btn').remove(); }
  })
  .catch(error => {
    console.log('error', error);
  })

  /* --- */

  function toggle_edit_box_view(e) {
    let unique_value = $(this).data('asset_field_unique_value');
    let selector = '#' + 'edit_asset_field_box_' + unique_value;
    $(selector).toggleClass("ghost-1");
  }



  function add_asset_field() {
    let asset_field_name = new_asset_field_name.val();
    let asset_field_value = new_asset_field_value.val();
    tools.setActionButtonsDisabledState(true);
    client.add_asset_field({ asset_field_name, asset_field_value, asset_id: asset.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }
      asset_fields[resp.new_asset_field.unique_value] = resp.new_asset_field;
      asset_fields_list.prepend($(resp.new_asset_field.dom));
      new_asset_field_name.val('');
      new_asset_field_value.val('');
      asset_fields_count.text(Object.keys(asset_fields).length);
    })
  }

  function edit_asset_field(e) {
    let unique_value = $(this).data('asset_field_unique_value');
    let field = asset_fields[unique_value];
    if(!field) { return; }

    let edit_fieldname_selector = '#' + 'edit_asset_field_name_input_' + unique_value;
    let edit_fieldvalue_selector = '#' + 'edit_asset_field_value_input_' + unique_value;

    let name = $(edit_fieldname_selector).val();
    let value = $(edit_fieldvalue_selector).val();

    tools.setActionButtonsDisabledState(true);
    client.edit_asset_field({ asset_field_name: name, asset_field_value: value, asset_field_id: field.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'asset_field_' + unique_value;
      let old_dom = $(old_dom_selector);
      let new_dom = $(resp.asset_field.dom);
      old_dom.replaceWith(new_dom);
      asset_fields[unique_value] = resp.asset_field;
      asset_fields_count.text(Object.keys(asset_fields).length);
    })
  }

  function delete_asset_field(e) {
    let unique_value = $(this).data('asset_field_unique_value');
    let field = asset_fields[unique_value];
    if(!field) { return; }
    let ask = window.confirm('Are you sure you want to delete "' + field.name + '"?');
    if(!ask) { return; }

    tools.setActionButtonsDisabledState(true);
    client.delete_asset_field({ asset_field_id: field.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'asset_field_' + unique_value;
      let old_dom = $(old_dom_selector);
      $(old_dom).remove();
      delete asset_fields[unique_value];
      asset_fields_count.text(Object.keys(asset_fields).length);
    })
  }

  function load_more_asset_fields() {
    let id_list = Object.keys(asset_fields).map(function(key){ return asset_fields[key].id });
    let min_id = id_list.reduce(function(a, b){ return Math.min(a, b) });
    client.get_asset_fields(asset.id, min_id)
    .then(function(resp){
      if(resp.asset_fields.length === 0) { return $('a#load-more-btn').remove(); }
      tools.array_sort_by(resp.asset_fields, "id", "desc").forEach(function(field) {
        asset_fields[field.unique_value] = field;
        asset_fields_list.append($(field.dom));
      });
    });
  }

  $(document).on('click', 'a#submit_new_asset_field_btn', add_asset_field);
  $(document).on('click', 'a.edit_asset_field_btn', toggle_edit_box_view);
  $(document).on('click', 'a.delete_asset_field_btn', delete_asset_field);
  $(document).on('click', 'a.submit_edits_asset_field_btn', edit_asset_field);
  $(document).on('click', 'a#load-more-btn', load_more_asset_fields);

});
