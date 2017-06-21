;
// Начинать писать отсюда!!!!
$(document).ready(function () {
	svg4everybody({});
	
	$('ul.menu__sub:last').addClass('left');
	// Определить отступ для выпадающего меню последней кнопки
	var menuLinkWidth = $('li.menu__item:last').width(),
		menuSubWidth = parseFloat($('ul.menu__sub:last').css('width')),
		menuSubLeft = menuLinkWidth - menuSubWidth;
	
	$('ul.menu__sub:last').css('left', menuSubLeft + 'px');
});

var maxHeight = 400;

$(function(){

    $(".dropdown > li").hover(function() {
    	
         var $container = $(this),
             $list = $container.find("ul"),
             $anchor = $container.find("a"),
             height = $list.height() * 1.1,       // make sure there is enough room at the bottom
             multiplier = height / maxHeight;     // needs to move faster if list is taller
        
        // need to save height here so it can revert on mouseout            
        $container.data("origHeight", $container.height());
        
        // so it can retain it's rollover color all the while the dropdown is open
        $anchor.addClass("hover");
        
        // make sure dropdown appears directly below parent list item    
        $list
            .show()
            .css({
                paddingTop: $container.data("origHeight")
            });
        
        // don't do any animation if list shorter than max
        if (multiplier > 1) {
            $container
                .css({
                    height: maxHeight,
                    overflow: "hidden"
                })
                .mousemove(function(e) {
                    var offset = $container.offset();
                    var relativeY = ((e.pageY - offset.top) * multiplier) - ($container.data("origHeight") * multiplier);
                    if (relativeY > $container.data("origHeight")) {
                        $list.css("top", -relativeY + $container.data("origHeight"));
                    };
                });
        }
        
    }, function() {
    
        var $el = $(this);
        
        // put things back to normal
        $el
            .height($(this).data("origHeight"))
            .find("ul")
            .css({ top: 0 })
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
  slidesToShow: 1,
  slidesToScroll: 1,
//  responsive: [
//    {
//      breakpoint: 1024,
//      settings: {
//        slidesToShow: 3,
//        slidesToScroll: 3,
//        infinite: true,
//        dots: true
//      }
//    },
//    {
//      breakpoint: 600,
//      settings: {
//        slidesToShow: 2,
//        slidesToScroll: 2
//      }
//    },
//    {
//      breakpoint: 480,
//      settings: {
//        slidesToShow: 1,
//        slidesToScroll: 1
//      }
//    }
//    // You can unslick at a given breakpoint now by adding:
//    // settings: "unslick"
//    // instead of a settings object
//  ]
});


$('a.services__block').hover(
	function() {
		$(this).addClass('hover');
	},
	function() {
		$(this).removeClass('hover');
	}
);