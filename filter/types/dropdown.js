/*--------------------------------------------------------*\
	Dropdown Menu Filters && Functionality

	TODO: I still need to make an error handler for non-matched
	sorts, and implement hash state.
\*--------------------------------------------------------*/

import els from 'els'
import { closest } from 'util'
import _ from 'lodash'
import hashState from '../../util/hashState'
import fastdom from 'fastdom'
import fastdomPromised from 'fastdom/extensions/fastdom-promised'
const fDOM = fastdom.extend(fastdomPromised)

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

	setStylesOnFilter: {
		measurements: [],
		mutations: [],

		measureItems(items) {
			_.forEach(items, item => {
				item = item.element
				this.measurements.push(fDOM.measure(() => {
					let { paddingTop, borderBottom, paddingBottom } = window.getComputedStyle(item)
					let paddingTopInt = parseInt(paddingTop, 10)
					let paddingBottomInt = parseInt(paddingBottom, 10)
					return { item, paddingTop: paddingTopInt, paddingBottom: paddingBottomInt, borderBottom }
				}))
			})

			return Promise.all(this.measurements)
		},
		
		mutateItems(items) {
			_.forEach(items, ({ item, paddingTop, paddingBottom, borderBottom }, index) => {
				this.mutations.push(fDOM.mutate(() => {
					if (index === 0 && paddingTop !== 0)  {
						item.style.paddingTop = 0
					}

					if (index !== 0 && paddingTop === 0) {
						item.style.paddingTop = '2.5rem'
					}

					if (index === (items.length - 1) && borderBottom !== '') {
						item.style.borderBottom = 0
					}

					if (index === (items.length - 1) && paddingBottom !== 0) {
						item.style.paddingBottom = 0
					}

					if (index !== (item.length - 1) && (paddingBottom === 0 || borderBottom === 0)) {
						item.style.paddingBottom = '2.5rem'
						item.style.borderBottom = '0.0625rem solid #d7d8d6'
					}
				}))
			})

			return Promise.all(this.mutations)
		},
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

		// Style padding based on filteredItems location
		// TODO: This needs to be abstracted as it's not a commonly shared method.
		let { filteredItems } = this.isotope
		this.setStylesOnFilter.measureItems(filteredItems)
			.then(items => this.setStylesOnFilter.mutateItems(items))
			.then(() => this.isotope.layout())
	},
	
	bindListeners() {
		_.forEach(this.filters, (filter) => {
			filter.addEventListener('click', this.changeActiveElement.bind(this, filter))
			filter.addEventListener('click', this.filterActiveItems.bind(this, filter))

			// I actually need to rewrite this for a dropdown implementation.
			hashState.call(filter, this.pathname)
		})
		this.menu.addEventListener('click', this.changeMenuState.bind(this))
		document.body.addEventListener('click', this.changeMenuState.bind(this))
	},
}

export default ({ menu, filters, isotope, sortOptions, filtersObject }) => {
	let { pathname } = els
	const { menuClass, activeClass } = els.ui.isotope.dropdowns.classes
	return Object.assign({
		menu,
		filters,
		isotope,
		sortOptions,
		filtersObject,
		menuClass,
		pathname,
		activeClass }, dropdown)
}
