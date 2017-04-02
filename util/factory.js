/*--------------------------------------------------------*\
	Instantiate Isotope Instance
\*--------------------------------------------------------*/

import isotopeSort from '../sort'

export default async function isotopeFactory(config, layout = 'masonry') {
	try {
		const Isotope = await import('isotope-layout')
		let { isotope, container, selector, gutter, sortOnLoad, sortOptions } = config
		let options = {
			itemSelector: selector,
			layoutMode: layout, 
			[layout]: {
				columnWidth: selector,
				gutter,
			},
			transitionDuration: 0,
			percentPosition: true,
		}

		// Merge sort options into config object
		Object.assign(options, isotopeSort.init(sortOptions))

		// Create Instance
		config.isotope = new Isotope(container, options)
		
		// Return the *modified* config. 
		return config
	}
	
	catch(err) {
		console.error('Webpack failed to load module: isotope-layout')
		return new Error(err)
	}
}
