$(document).ready(function(){

  let account_icon = $('#account-icon');
  let first_name_span = $('#first_name_span');
  let middle_name_span = $('#middle_name_span');
  let last_name_span = $('#last_name_span');
  let submit_icon_btn = $('#submit-icon-btn');

  let session;
  let user_fields = {};

  let init_promises = [
    client.check_session()
  ];

  Promise.all(init_promises)
  .then(values => {
    session = values[0];
    init_done();
  })
  .catch(error => {
    console.log('error', error);
  })

  function init_done() {
    account_icon.attr("src", session.user.icon);
    first_name_span.text(tools.capitalize(session.user.fname));
    middle_name_span.text(tools.capitalize(session.user.mname));
    last_name_span.text(tools.capitalize(session.user.lname));
  }

  /* --- */

  submit_icon_btn.click(function(){
    let file = document.getElementById('icon-input').files[0];
    let form_data = new FormData();
    form_data.append('icon_image', file);
    tools.setActionButtonsDisabledState(true);
    client.update_icon(form_data)
    .then(resp => {
      tools.setActionButtonsDisabledState(false);
      M.toast({html: resp.message});
      if(resp.error) { return; }
      document.getElementById('icon-input').value = "";
      document.getElementById('icon-input-text').value = "";
      session.user = resp.user;
      account_icon.attr("src", session.user.icon);
    })
  });

});
