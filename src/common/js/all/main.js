;
$(document).ready(function() {
$('#clients__slick').slick({
	dots: true,
	infinite: false,
	speed: 300,
	arrows: false,
	slidesToShow: 5,
	slidesToScroll: 5,
	responsive: [
		{
			breakpoint: 993,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 4
			}
		},
		{
			breakpoint: 769,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		},
		{
			breakpoint: 561,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
	]
});
$('#slider__slick').slick({
    dots: true,
    speed: 300,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1
});
var menuBtn = $('#menuBtn'),
	mainMenu = $('#menuNav');

menuBtn.click(function () {
	mainMenu.slideToggle(1000, function () {
		$(this).toggleClass('activ').removeAttr('style');
	});
});

$(window).resize(function() {
	if(btn.css('display') === 'none') {
		menu.removeClass('activ');
	}
});

});