const smartgrid = require('smart-grid');

// SMARTGRID
let settings = {
	filename: "smart-grid",
	outputStyle: 'scss', /* less || scss || sass || styl */
	columns: 24, /* number of grid columns */
	offset: '10px', /* gutter width px || % */
	mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
	container: {
		maxWidth: '980px', /* max-width оn very large screen */
		fields: '20px' /* side fields */
	},
	breakPoints: {
		// lg: {
		// 	width: '980px' /* -> @media (max-width: 1100px) */
		// },
		md: {
			width: '992px'
		},
		sm: {
			width: '768px',
			fields: '15px'
		},
		xs: {
			width: '560px'
		}
	}
};

smartgrid('src/common/scss/mixins', settings);
