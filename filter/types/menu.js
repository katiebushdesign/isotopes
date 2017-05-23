/*--------------------------------------------------------*\
	Menu Filter Type

	TODO:

	(1) I should probably pass in the hash through here
	instead of making a reference to els?
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'

function menuFilters({ isotope, sortOptions }, filterItems, sortOnLoad = { init: false, defaultFilter: null }) {

	// Clear hash, if hash exists
	if (els.hash !== '') window.location.hash = ''

	// Do not run on initial load as active filter should already be selected via HTML options
	if (!sortOnLoad.init) {

		// Clear all filters, add active filter class
		_.forEach(filterItems, item => item.classList.remove('filter__item--active'))

		// Add active class to selected filter
		this.classList.add('filter__item--active')
	}

	// Get the filter
<<<<<<< HEAD
	let filter = this.getAttribute('data-filter')
	
=======
	let filter = sortOnLoad.init ? sortOnLoad.defaultFilter.getAttribute('data-filter') : this.getAttribute('data-filter')
	let duration = sortOnLoad.init ? 0 : 500

>>>>>>> 2eb5d14... major updates
	// If filter contains '.' it is a class, thus it should be run individually.
	// Otherwise run the '*' (all) filter.
	// This leaves all as the default options, and also mitigates errors if data-filters are misconfigured.
	let config = Object.assign(sortOptions, {
		filter: filter.indexOf('.') > -1 ? filter : '*',
		transitionDuration: duration,
	})

	isotope.arrange(config)
	isotope.layout()
}

export default menuFilters
