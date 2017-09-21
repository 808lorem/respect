$('.js-slick__slider').slick({
    dots: true,
    infinite: false,
    speed: 300,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1
});

$('.js-slick__clients').slick({
    dots: false,
    infinite: false,
    speed: 300,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});