console.log("navscripts.js file connected");

(function() {
    'use strict';
    $('.ham-hamburger-menu').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
            $('.nav-menu-overlay').fadeToggle( 'fast', 'linear' );
            $('.ham-nav-menu .ham-menu-list').slideToggle( 'slow', 'swing' );
            $('.ham-hamburger-menu-wrapper').toggleClass('bounce-effect');
        } else {
            $(this).addClass('active');
            $('.nav-menu-overlay').fadeToggle( 'fast', 'linear' );
            $('.ham-nav-menu .ham-menu-list').slideToggle( 'slow', 'swing' );
            $('.ham-hamburger-menu-wrapper').toggleClass('bounce-effect');
        }
    })
})();
