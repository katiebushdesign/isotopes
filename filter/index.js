/*--------------------------------------------------------*\
	Isotope Filtering Function

	TODO:

	(1) Maybe move hashstate outside the conditionals,
	to the bottom so that it's called either way instead
	of repeating it.

	(2) Need to figure out the best options for the
	sortOnLoad options.
\*--------------------------------------------------------*/

import els from 'els'
import { menu, dropdown } from './types'
import _ from 'lodash'

function isotopeFilter(config, ui) {
	let { filterType, sortOnLoad } = config
	let {
		filters: filterItems,
		inputs,
		menus,
		dropdowns: {
			menus: dropdownMenus,
		}
	} = ui

	// Menu Filters
	if (filterType === 'menu') {
		if (sortOnLoad === true) {
			let defaultFilter = [...filterItems].filter(item => item.classList.contains('filter__item--active')).pop()
			menu.call(null, config, filterItems, {
				init: true,
				defaultFilter,
			})
		}
		_.forEach(filterItems, item => item.addEventListener('click', function() {
			menu.call(this, config, filterItems)
		}))
	}

	// Dropdown Filters
	else if (filterType === 'dropdown') {
		_.forEach(dropdownMenus, menu => {
			let menuItems = menu.querySelectorAll('.filter__item')
			ui.dropdowns.instances.push(dropdown(config, ui, { menu, menuItems }).bindListeners())
		})
	}

	// Checkbox Filters
	else if (filterType === 'checkbox') {
		return false
	}
}

export default isotopeFilter
