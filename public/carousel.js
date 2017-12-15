//carousel

var owl = $('.owl-carousel');
owl.owlCarousel({
    items: 1,
    loop: true,
    margin: 0,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    nav: true
});
var carouselBtn = $('.owl-carousel');
owl.owlCarousel();
$('#next').click(function () {
    "use strict";
    carouselBtn.trigger('next.owl.carousel');
});

$('#prev').click(function () {
    "use strict";
    carouselBtn.trigger('prev.owl.carousel', [300]);
});