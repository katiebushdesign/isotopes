/*--------------------------------------------------------*\
	Menu Filter Type
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'

function menuFilters(isotope, sortOptions, filters, id) {

	// Clear hash, if hash exists
	if (els.hash !== '') window.location.hash = ''

	// Clear all filters, add active filter class
	_.forEach(filters, (filter) => filter.classList.remove('filter__item--active'))
	this.classList.add('filter__item--active')

	// Get the filter
	let filter = this.getAttribute('data-filter')

	// Specific to team ... TODO: Need to abstract this.
	let all = (id === 'team') ? '*:not(.filter--affiliatedPartners):not(.filter--advisors)' : '*'
	console.log(id)

	// If filter contains '.' it is a class, thus it should be run individually.
	// Otherwise run the '*' (all) filter.
	// This leaves all as the default options, and also mitigates errors if data-filters are misconfigured.
	sortOptions = !!sortOptions ? sortOptions : {}
	let config = Object.assign(sortOptions, {
		filter: filter.indexOf('.') > -1 ? filter : all,
		transitionDuration: 500,
	})

	console.log(config)
	
	isotope.arrange(config)
	isotope.layout()
}

export default menuFilters
