/*--------------------------------------------------------*\
	Isotope Filtering Function

	TODO: Maybe move hashstate outside the conditionals,
	to the bottom so that it's called either way instead
	of repeating it.
\*--------------------------------------------------------*/

import els from 'els'
import { getMenu } from './types/checkbox'
import { menu, dropdown, checkbox } from './types'
// import hashState from '../util/hashState'
import _ from 'lodash'

function isotopeFilter({ isotope, sortOptions, sortOnLoad, filters: filtersObject }) {
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

		// If "All" filter is not present, select the correct default filter
		if (sortOnLoad[1] != null) {
			let activeFilter = [...filters].filter(filter => filter.id === `filter--${sortOnLoad[1]}`)
			menu.call(activeFilter[0], isotope, sortOptions, filters)
		}

		_.forEach(filters, (filter) => {
			filter.addEventListener('click', function(event) {
				let { pathname } = els
				menu.call(filter, isotope, sortOptions, filters)
				// hashState.call(filter, pathname)
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
		})
	}

	// Checkbox Filters
	else if (filterType === 'checkbox') {
		getMenu()
		_.forEach(inputs, input => {
			input.addEventListener('click', checkbox.bind(input, filtersObject, isotope))
		})
	}
}

export default isotopeFilter
