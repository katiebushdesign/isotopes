/*--------------------------------------------------------*\
	Dropdown Menu Filters && Functionality
\*--------------------------------------------------------*/

import els from 'els'
import { closest } from 'util'
import _ from 'lodash'
// import fastdom from 'fastdom'

const dropdown = {

	changeMenuState() {
		let menuTarget = closest(event.target, 'menu--dropdown')

		if (!menuTarget) {
			this.menu.classList.remove('dropdown--active')
		}

		else if (menuTarget === this.menu) {
			event.cancelBubble = true
			this.menu.classList.toggle('dropdown--active')
		}
	},

	changeActiveElement(filter) {
		let group = closest(filter, this.menuClass)
		let activeElement = group.querySelector(`.${this.activeClass}`)
		let currentFilter = group.getAttribute('data-active')
		let nextFilter = filter.getAttribute('data-filter')
		let nextID = filter.id
		let nextText = filter.textContent

		if (nextID !== currentFilter) {
			activeElement.textContent = nextText
			group.setAttribute('data-active', nextID)
		}
	},

	filterActiveItems(filter) {

		// Fetch the group filter accordingly
		let group = closest(filter, 'menu--dropdown').getAttribute('data-filter-group')

		// Get the filters
		let activeFilters = ''
		this.filtersObject[group] = filter.getAttribute('data-filter')

		// Add them to the string from the object
		for (let key in this.filtersObject) {
			activeFilters += this.filtersObject[key]
		}

		// If filter contains '.' it is a class, thus it should be run individually.
		// Otherwise run the '*' (all) filter.
		// This leaves all as the default options, and also mitigates errors if data-filters are misconfigured.
		this.sortOptions = !!this.sortOptions ? this.sortOptions : {}
		let config = Object.assign(this.sortOptions, {
			filter: activeFilters.indexOf('.') > -1 ? activeFilters : '*',
			transitionDuration: 500,
		})

		this.isotope.arrange(config)
		this.isotope.layout()
	},
	
	bindListeners() {
		_.forEach(this.filters, (filter) => {
			filter.addEventListener('click', this.changeActiveElement.bind(this, filter))
			filter.addEventListener('click', this.filterActiveItems.bind(this, filter))
		})
		this.menu.addEventListener('click', this.changeMenuState.bind(this))
		document.body.addEventListener('click', this.changeMenuState.bind(this))
	},
}

export default ({ menu, filters, isotope, sortOptions, filtersObject }) => {
	const { menuClass, activeClass } = els.ui.isotope.dropdowns.classes
	return Object.assign({
		menu,
		filters,
		isotope,
		sortOptions,
		filtersObject,
		menuClass,
		activeClass }, dropdown)
}
