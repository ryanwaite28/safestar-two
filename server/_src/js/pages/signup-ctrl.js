$(document).ready(function(){

  $('#submit-btn').click(function(){
    let fname = $('#first_name_input').val();
    let mname = $('#middle_name_input').val();
    let lname = $('#last_name_input').val();
    let email = $('#email_input').val();
    let password = $('#password_input').val();
    let password_verify = $('#password_verify_input').val();

    let data_obj = { fname, mname, lname, email, password, password_verify };

    client.sign_up(data_obj)
    .then(resp => {
      if(resp.error) { return M.toast({html: resp.message}); }
      M.toast({html: resp.message});
      setTimeout(() => { window.location.href = '/account'; }, 2000);
    })
  });

});
