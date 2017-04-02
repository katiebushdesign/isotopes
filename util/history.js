/*--------------------------------------------------------*\
	Isotope ==> Load via History API
\*--------------------------------------------------------*/

import els from 'els'

export default function history(config) {
	let { pathname, history } = els
	let { state, path } = history
	if (pathname.indexOf(path)) {
		console.log('true!')
	}

	else {
		console.log('false!')
	}

	// let id = history.state.filter.split('.')
	// if (history.state.filtered == '*') {
	// 	history.state.filtered = null
		
	// 	// Save and return the object
	// 	options.iso = iso
	// 	return iso
	// }
	// let checkbox = document.querySelector('#' + id[1])
	// if (checkbox.checked == false) {
	// 	checkbox.checked = true
	// }
	// iso.arrange({ filter: history.state.filtered })
	// iso.layout()
}

