;
$(document).ready(function() {
let btn = $('#menuBtn'),
	menu = $('#menuNav');

btn.click(function () {
	menu.slideToggle(1000, function () {
		$(this).toggleClass('activ').removeAttr('style');
	});
});

$(window).resize(function() {
	if(btn.css('display') === 'none') {
		menu.removeClass('activ');
	}
});
$('#slider__slick').slick({
    dots: true,
    speed: 300,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1
});

});