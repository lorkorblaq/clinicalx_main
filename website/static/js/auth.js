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

  $('#reg_lab').on('click', function() {
    // alert('Registration for labs is not available at the moment. Please check back later.');
    $('#myModal').css('display', 'block');
  });

  $('.close').on('click', function() {
    $('#myModal').css('display', 'none');
  });

  // Optionally, close the modal when clicking outside of the modal content
  $(window).on('click', function(event) {
    if ($(event.target).is('#myModal')) {
        $('#myModal').css('display', 'none');
    }
  });
});
