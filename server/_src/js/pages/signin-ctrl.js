$(document).ready(function(){

  $('#submit-btn').click(function(){
    let email = $('#email_input').val();
    let password = $('#password_input').val();

    let data_obj = { email, password };

    client.sign_in(data_obj)
    .then(resp => {
      if(resp.error) { return M.toast({html: resp.message}); }
      M.toast({html: resp.message});
      setTimeout(() => { window.location.href = '/account'; }, 2000);
    })
  });

});
