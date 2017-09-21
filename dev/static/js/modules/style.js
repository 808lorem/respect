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
