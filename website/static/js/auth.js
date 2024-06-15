$(document).ready(function() {
  function showSignInForm() {
    $('.signIn').addClass('active-dx').removeClass('inactive-sx');
    $('.signUp').addClass('inactive-dx').removeClass('active-sx');
  }

  function showSignUpForm() {
    $('.signIn').addClass('inactive-sx').removeClass('active-dx');
    $('.signUp').addClass('active-sx').removeClass('inactive-dx');
  }

  $('.log-in').on('click', function() {
    showSignInForm();
  });

  $('.back').on('click', function() {
    showSignUpForm();
  });
});
