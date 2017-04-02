/*--------------------------------------------------------*\
	Isotope Filtering Function
\*--------------------------------------------------------*/

import els from 'els'
import menu from './types/menu'
import _ from 'lodash'

function isotopeFilter({ isotope, sortOptions }) {
	let { hash } = els
	let { filters, inputs, menus } = els.ui.isotope

	// Set filter selectors
	filters = inputs.length ? inputs : filters
	
	// Set filter type 
	let filterType =
		inputs.length ? 'checkbox' 
			: menus.length ? 'menu' : 'dropdown'

	// Loop through filterElements
	_.forEach(filters, (filter) => {
		filter.addEventListener('click', function(event) {

			// Begin filtering
			if (filterType === 'menu') {
				menu.call(this, isotope, sortOptions, filters)
			}
			
			// Store filters via History API
			let id = `#${filter.id.split('filter--')[1]}`
			let activeHash = (id === '#all') ? null : id
			let path = els.pathname.split('/').filter(item => item != '').shift()
			history.pushState({ filter: activeHash, path }, null, activeHash)
		})
	})
}

export default isotopeFilter
