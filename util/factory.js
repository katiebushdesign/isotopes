/*--------------------------------------------------------*\
	Instantiate Isotope Instance
\*--------------------------------------------------------*/

import isotopeSort from '../sort'

export default async function isotopeFactory(config) {
	try {
		const Isotope = await import('isotope-layout')
		let layoutLoader = null, IsotopeLayoutLib = null
		if (config.layout !== 'masonry') {
			const layoutLoader = await import('./layoutLoader')
			const IsotopeLayoutLib = await layoutLoader.default(config.layout)
		}

		let { layout, isotope, container, selector, gutter, sortOptions } = config
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

		// Only merge sortOptions if Object has property (otherwise it will throw an error)
		if (Object.hasOwnProperty('sortOptions')) {

			// Merge sort options into config object
			Object.assign(options, isotopeSort.init(sortOptions))
		}

		// Create Instance
		config.isotope = new Isotope(container, options)
<<<<<<< HEAD
		
		// Return the *modified* config. 
=======

		// Return the modified config.
>>>>>>> 2eb5d14... major updates
		return config
	}

	catch(err) {
		console.error('Webpack failed to load module: isotope-layout')
		return new Error(err)
	}
}
