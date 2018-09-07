$(document).ready(function(){

  let new_user_asset_name = $('#new_user_asset_name');

  let user_assets_count = $('#user_assets_count');
  let user_assets_list = $('#user_assets_list');
  let first_name_span = $('#first_name_span');
  let middle_name_span = $('#middle_name_span');
  let last_name_span = $('#last_name_span');

  let session;
  let user_assets = {};

  let init_promises = [
    client.check_session(),
    client.get_user_assets()
  ];

  Promise.all(init_promises)
  .then(values => {
    let session = values[0];
    first_name_span.text(tools.capitalize(session.user.fname));
    middle_name_span.text(tools.capitalize(session.user.mname));
    last_name_span.text(tools.capitalize(session.user.lname));
    tools.array_sort_by(values[1].user_assets, "id", "desc").forEach(asset => {
      user_assets[asset.unique_value] = asset;
      user_assets_list.append($(asset.dom));
    });
    user_assets_count.text(Object.keys(user_assets).length);
    console.log(values, user_assets);
  })
  .catch(error => {
    console.log('error', error);
  })

  /* --- */

  function toggle_edit_box_view(e) {
    let unique_value = $(this).data('user_asset_unique_value');
    let selector = '#' + 'edit_user_asset_box_' + unique_value;
    $(selector).toggleClass("ghost-1");
  }



  function add_user_asset() {
    let asset_name = new_user_asset_name.val();
    tools.setActionButtonsDisabledState(true);
    client.add_user_asset({ asset_name })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }
      user_assets[resp.new_user_asset.unique_value] = resp.new_user_asset;
      user_assets_list.prepend($(resp.new_user_asset.dom));
      new_user_asset_name.val('');
      user_assets_count.text(Object.keys(user_assets).length);
    })
  }

  function edit_user_asset(e) {
    let unique_value = $(this).data('user_asset_unique_value');
    let asset = user_assets[unique_value];
    if(!asset) { return; }

    let edit_assetname_selector = '#' + 'edit_user_asset_name_input_' + unique_value;
    let edit_assetvalue_selector = '#' + 'edit_user_asset_value_input_' + unique_value;

    let asset_name = $(edit_assetname_selector).val();
    let value = $(edit_assetvalue_selector).val();

    tools.setActionButtonsDisabledState(true);
    client.edit_user_asset({ asset_name, asset_id: asset.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'user_asset_' + unique_value;
      let old_dom = $(old_dom_selector);
      let new_dom = $(resp.user_asset.dom);
      old_dom.replaceWith(new_dom);
      user_assets[unique_value] = resp.user_asset;
      user_assets_count.text(Object.keys(user_assets).length);
    })
  }

  function delete_user_asset(e) {
    let unique_value = $(this).data('user_asset_unique_value');
    let asset = user_assets[unique_value];
    if(!asset) { return; }

    let ask = window.confirm('Are you sure you want to delete "' + asset.name + '"?');
    if(!ask) { return; }

    tools.setActionButtonsDisabledState(true);
    client.delete_user_asset({ asset_id: asset.id })
    .then(resp => {
      console.log(resp);
      tools.setActionButtonsDisabledState(false);
      window.M.toast({html: resp.message});
      if(resp.error) { return; }

      let old_dom_selector = '#' + 'user_asset_' + unique_value;
      let old_dom = $(old_dom_selector);
      $(old_dom).remove();
      delete user_assets[unique_value];
      user_assets_count.text(Object.keys(user_assets).length);
    })
  }

  $(document).on('click', 'a#submit_new_user_asset_btn', add_user_asset);
  $(document).on('click', 'a.edit_user_asset_btn', toggle_edit_box_view);
  $(document).on('click', 'a.delete_user_asset_btn', delete_user_asset);
  $(document).on('click', 'a.submit_edits_user_asset_btn', edit_user_asset);

});
