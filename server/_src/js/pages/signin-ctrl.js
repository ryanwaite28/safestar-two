$(document).ready(function(){

  $('#submit-btn').click(function(){
    let email = $('#email_input').val();
    let password = $('#password_input').val();

    let data_obj = { email, password };

    client.sign_in(data_obj)
    .then(resp => {
      M.toast({html: resp.message});
      if(resp.error) { return; }
      setTimeout(() => { window.location.href = '/account'; }, 500);
    })
  });

});
