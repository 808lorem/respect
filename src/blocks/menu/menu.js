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