;
function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
include('static/js/modules/slider.js');
$(document).ready(function() {
    svg4everybody({});

    $(window).resize(function() {
        var widthWindow = $("body").width();

        if(widthWindow > 768) {
            $('nav.menu__nav').css({"display": 'block'});
            addLeftLastSubMenu();
            $('ul.menu__sub:last').css('top', 'auto');
            addWidthButtonMainMenu();
        } else {
            $('ul.menu__sub:last').css('left', 'auto');
            $('nav.menu__nav').css({"display": 'none'});
            $('.menu__item').width('50%');

            $('li.menu__item:last a').click(addTopLastSubMenu);
        }

        console.log(widthWindow);

    });


    // вызовем событие resize
    $(window).resize();
});

/**
 * устанавливает ширину кнопок главного меню
 */
function addWidthButtonMainMenu() {
    var mainMenuWidth = $(".menu__nav").width(),
        allButtonMainMenu = $(".menu__list").find(".menu__item").length,
        result = mainMenuWidth / allButtonMainMenu;

    $(".menu__item").width(result.toFixed(2));
}

/**
 * добавит левый отступ выпадаюшего списка последней кнопки главного меню
 * при ширине страницы > 768px
 */
function addLeftLastSubMenu() {
    var menuLinkWidth = parseFloat($('li.menu__item:last').css('width')),
        menuSubWidth = parseFloat($('ul.menu__sub:last').css('width')),
        menuSubLeft = menuLinkWidth - menuSubWidth;

    $('ul.menu__sub:last').css('left', menuSubLeft + 'px');
    console.log(menuSubLeft + ' = ' + menuLinkWidth + " - " + menuSubWidth);
}

/**
 * добавит верхний отступ выпадаюшего списка последней кнопки главного меню
 * при ширине страницы < 768px
 */
function addTopLastSubMenu() {
    var menuLinkHeight = 57,
        menuSubWidth = parseFloat($('ul.menu__sub:last').css('height')),
        menuSubTop = menuLinkHeight - menuSubWidth;
    $('ul.menu__sub:last').css('top', menuSubTop + 'px');
}


$(function() {

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