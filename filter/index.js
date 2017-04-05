/*--------------------------------------------------------*\
	Isotope Filtering Function

	TODO: Maybe move hashstate outside the conditionals,
	to the bottom so that it's called either way instead
	of repeating it.
\*--------------------------------------------------------*/

import els from 'els'
import { menu, dropdown } from './types'
import hashState from '../util/hashState'
import _ from 'lodash'

function isotopeFilter({ isotope, sortOptions, filters: filtersObject }) {
	let { 
		hash,
		ui: {
			isotope: {
				filters, 
				inputs, 
				menus, 
				dropdowns: { elements }
			}
		}
	} = els

	// Set filter selectors based on element type
	filters = inputs.length ? inputs : filters
	
	// Set filter type 
	let filterType = inputs.length ? 'checkbox' : (menus.length ? 'menu' : 'dropdown')
	
	// Menu Filters
	if (filterType === 'menu') {
		_.forEach(filters, (filter) => {
			filter.addEventListener('click', function(event) {
				let { pathname } = els
				menu.call(filter, isotope, sortOptions, filters)
				hashState.call(filter, pathname)
			})
		})
	}
	
	// Dropdown Filters
	else if (filterType === 'dropdown') {
		_.forEach(elements, (element) => {
			let config = {
				menu: element,
				filters: element.querySelectorAll('.filter__item'),
				isotope,
				sortOptions,
				filtersObject,
			}
			dropdown(config).bindListeners()

			// // I need to loop this over all the filters, not just the menus
			// hashState.call(filter, pathname)
		})
	}
	
	// Checkbox Filters
	else if (filterType === 'checkbox') {
		return false
	}
}

export default isotopeFilter
