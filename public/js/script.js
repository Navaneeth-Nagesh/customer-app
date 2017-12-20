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




    $(document).ready(function() {
        'use strict';
        $('.scroll-up[href*=#]').click(function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
                location.hostname === this.hostname) {
                var $target = $(this.hash);
                $target = $target.length && $target ||
                    $('[name=' + this.hash.slice(1) + ']');
                if ($target.length) {
                    var targetOffset = $target.offset().top;
                    $('html,body')
                        .animate({
                            scrollTop: targetOffset
                        }, 500);
                    return false;
                }
            }
        });
    });
