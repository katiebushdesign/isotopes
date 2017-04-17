/*--------------------------------------------------------*\
	Instantiate Isotope Instance
\*--------------------------------------------------------*/

import isotopeSort from '../sort'
import _ from 'lodash'

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
		
		// Only merge sortOptions if Object has property (otherwise it will throw an error)
		if (Object.hasOwnProperty('sortOptions')) {
			
			// Merge sort options into config object
			Object.assign(options, isotopeSort.init(sortOptions))
		}

		// Create Instance
		config.isotope = new Isotope(container, options)

		// Build Data Tree
		// TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO // Don't really know where to put this either.
		// let { items } = config
		// let data = Array.from(items).map(item => {
		// 	let classes = item.className.split(' ')
		// 	let filters = classes
		// 		.filter(className => className.indexOf('filter') > -1)
		// 		.map(className => className.split('filter--')[1])
		// 	return filters
		// })
		
		// let allFilters = _.unique(_.flatten(data))
		// let filtersObj = allFilters.reduce((obj, filter) => ({ ...obj, [filter]: [] }), {})
		

		// _.forEach(data, filter => {
			
		// 	let filterArray = filter

		// 	_forEach(filterArray, f => {
		// 		if ()				
		// 	})
		// })


		// Return the *modified* config. 
		return config
	}
	
	catch(err) {
		console.error('Webpack failed to load module: isotope-layout')
		return new Error(err)
	}
}
