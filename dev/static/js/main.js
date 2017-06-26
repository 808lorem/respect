;
// Начинать писать отсюда!!!!
$(document).ready(function () {
	svg4everybody({});
	
	$(window).resize(function(){
		
		var containerWidth = $('.container').css('width');
		
		if (containerWidth == '960px') {
			$('nav.menu__nav').css({"display":'block'});
			// Определить отступ для выпадающего меню последней кнопки
			var menuLinkWidth = $('li.menu__item:last').width(),
				menuSubWidth = parseFloat($('ul.menu__sub:last').css('width')),
				menuSubLeft = menuLinkWidth - menuSubWidth;

			$('ul.menu__sub:last').css('left', menuSubLeft + 'px');
		} else {
			$('ul.menu__sub:last').css('left', 'auto');
			
			$('nav.menu__nav').css({"display":'none'});
		}
	});

	// вызовем событие resize
	$(window).resize();
});

var maxHeight = 400;

$(function(){

    $(".dropdown > li").hover(function() {
    	
         var $container = $(this),
             $list = $container.find("ul"),
             $anchor = $container.find("a");     // needs to move faster if list is taller
        
        // need to save height here so it can revert on mouseout            
        $container.data("origHeight", $container.height());
        
        // so it can retain it's rollover color all the while the dropdown is open
        $anchor.addClass("hover");
        
        // make sure dropdown appears directly below parent list item    
        $list
            .show();
        
    }, function() {
    
        var $el = $(this);
        
        // put things back to normal
        $el
            .height($(this).data("origHeight"))
            .find("ul")
            .hide()
            .end()
            .find("a")
            .removeClass("hover");
    
    });

});


$('.js-slick__slider').slick({
	dots: true,
	infinite: false,
	speed: 300,
	arrows: false,
	slidesToShow: 1,
	slidesToScroll: 1,
});


$('a.services__block').hover(
	function() {
		$(this).addClass('hover');
	},
	function() {
		$(this).removeClass('hover');
	}
);

$("a.menu__btn").click(function() {
		$('nav.menu__nav').toggle("display");
	return false;
});