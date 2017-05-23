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

<<<<<<< HEAD
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
=======
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
>>>>>>> 2eb5d14... major updates
			})
		}
		_.forEach(filterItems, item => item.addEventListener('click', function() {
			menu.call(this, config, filterItems)
		}))
	}
	
	// Dropdown Filters
	else if (filterType === 'dropdown') {
<<<<<<< HEAD
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
=======
		_.forEach(dropdownMenus, menu => {
			let menuItems = menu.querySelectorAll('.filter__item')
			dropdown(config, ui, { menu, menuItems })
				.bindListeners()
				.buildDataTree()
>>>>>>> 2eb5d14... major updates
		})
	}
	
	// Checkbox Filters
	else if (filterType === 'checkbox') {
		return false
	}
}

export default isotopeFilter
