/*--------------------------------------------------------*\
	Instantiate Isotope Instance
\*--------------------------------------------------------*/

import isotopeSort from '../sort'
import _ from 'lodash'

export default async function isotopeFactory(config) {
	let library = config.hasOwnProperty('type') ? config.type.lib : 'isotope-layout'
	let layout = config.hasOwnProperty('type') ? config.type.layout : 'masonry'
	try {
		const Isotope = await import('isotope-layout')
		const Packery = (layout === 'packery') ? await import ('isotope-packery') : false
		let { isotope, container, selector, columnWidth, gutter, sortOnLoad, sortOptions } = config
		let options = {
			itemSelector: selector,
			layoutMode: layout, 
			[layout]: {
				columnWidth: columnWidth || selector,
				gutter,
			},
			transitionDuration: 0,
			percentPosition: true,
		}
		
		// Only merge sortOptions if Object has property (otherwise it will throw an error)
		if (Object.hasOwnProperty('sortOptions')) {
			
			// Merge sort options into config object
			Object.assign(options, isotopeSort.init(sortOptions))
		}

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
