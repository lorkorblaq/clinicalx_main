$(document).ready(function () {
    console.log('landing page ready!');
    const navLinks = $('.nav-links a');

    navLinks.on('click', function (e) {
        e.preventDefault();
        const targetId = $(this).attr('href').substring(1);
        const targetElement = $('#' + targetId);

        $('html, body').animate({
            scrollTop: targetElement.offset().top
        }, 500);
    });

    const contactForm = $('.contact form');
    contactForm.on('submit', function (e) {
        e.preventDefault();
        alert('Form submitted!');
    });

    $('#hamburger').click(function() {
        console.log('clicked');
        $('#nav-menu').toggleClass('active');
    });
    
});
