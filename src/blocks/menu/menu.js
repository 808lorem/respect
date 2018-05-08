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