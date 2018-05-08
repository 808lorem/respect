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