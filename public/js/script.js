/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
    'use strict';
    $('.deleteuser').on('click', deleteUser);
});

function deleteUser() {
    'use strict';
    var confirmation = confirm('are you sure?');
    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/employee_data/delete/' + $(this).data('id')
        }).done(function (response) {
            window.location.replace('/home');
        });
        window.location.replace('/home');
    } else {
        return false;
    }
}


// scroll functionality

$(window).scroll(function() {    
    'use strict';
    var scroll = $(window).scrollTop();

    if (scroll >= 500) {
        $(".scroll-up").removeClass("scroll_hidden");
    } else {
        $(".scroll-up").addClass("scroll_hidden");
    }
});


//smooth-scrolling


$('a[href*="#"]')
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });