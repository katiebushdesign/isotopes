/*--------------------------------------------------------*\
	Isotope Resize

	TODO: Use window.matchMedia instead?
\*--------------------------------------------------------*/

import _debounce from 'lodash.debounce'

function resize(iso, breakpoints, defaultGutter) {
	for (let i = 0; i < breakpoints.length; i++) {
		const { gutter } = breakpoints[i]
		
		if (window.innerWidth <= breakpoints[i].width) {
			iso.options.masonry.gutter = gutter
		}

		else if (
			breakpoints[i + 1] != null &&
			window.innerWidth > breakpoints[i].width && 
			window.innerWidth < breakpoints[i + 1].width
		) {
			iso.options.masonry.gutter = breakpoints[i + 1].gutter
		}

		else {
			iso.options.masonry.gutter = defaultGutter
		}
	}

	return iso.layout()
}

function getColumnWidth(items) {
	let item = items[2]
	let { width } = item.getBoundingClientRect()
	return width
}

function setColumnWidth(options) {
	let { items } = options
	let width = getColumnWidth(items)
	options.iso.options.masonry.columnWidth = width
	return options.iso.layout()
}

function resizeInit(options) {
	const { iso, breakpoints, gutter } = options
	if (breakpoints.length > 0) {
		
		// Call if window is less than first breakpoints parameter
		if (window.innerWidth <= breakpoints[0].width) {
			resize.call(null, iso, breakpoints, gutter)
		}
		
		// Attach resize event for all ongoing resizes
		window.addEventListener('resize', _debounce(resize.bind(null, iso, breakpoints, gutter), 150))
	}

	if (options.selector === '.box__item') {
		window.addEventListener('resize', _debounce(setColumnWidth.bind(null, options)))
	}
}

export default resizeInit
