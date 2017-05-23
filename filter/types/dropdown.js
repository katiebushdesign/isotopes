/*--------------------------------------------------------*\
	Dropdown Menu Filters && Functionality
<<<<<<< HEAD
=======

	TODO:

	(1) I still need to make an error handler for non-matched
	sorts
	(2) Implement hash state.
	(3) Possibly abstract style method based on some kind
	of options and then style from there. Perhaps the method
	itself could also be used for other configs. (Actually this is probably necessary)
	(4) Split mutate function into separate functions, or maybe even an object?
>>>>>>> 2eb5d14... major updates
\*--------------------------------------------------------*/

import { closest } from 'util'
import _ from 'lodash'
<<<<<<< HEAD
// import fastdom from 'fastdom'
=======
import fastdom from 'fastdom'
import fastdomPromised from 'fastdom/extensions/fastdom-promised'
const fDOM = fastdom.extend(fastdomPromised)
>>>>>>> 2eb5d14... major updates

const dropdown = {

	changeMenuState(event) {
		let menuGroup = closest(event.target, this.menuClass)
		if (!menuGroup) {
			this.menu.classList.remove(this.activeMenuClass)
		} else if (menuGroup === this.menu) {
			event.cancelBubble = true
			this.menu.classList.toggle(this.activeMenuClass)
		}
	},

	setActiveMenuItem(menuItem) {
		let group = closest(menuItem, this.menuClass)
		let activeElement = group.querySelector(`.${this.activeItemClass}`)
		let currentFilter = group.getAttribute('data-active')
		let nextFilter = menuItem.getAttribute('data-filter')
		let nextID = menuItem.id
		let nextText = menuItem.textContent
		if (nextID !== currentFilter) {
			activeElement.textContent = nextText
			group.setAttribute('data-active', nextID)
		}
	},

<<<<<<< HEAD
	filterActiveItems(filter) {
=======
	setStylesOnFilter: {
		measurements: [],
		mutations: [],

		measureItems(items, selector) {
			let itemStyles = this.getStyleSheetRules(selector)
			_.forEach(items, item => {
				item = item.element
				this.measurements.push(fDOM.measure(() => {
					let { paddingTop, borderBottom, paddingBottom } = window.getComputedStyle(item)
					let paddingTopInt = parseInt(paddingTop, 10)
					let paddingBottomInt = parseInt(paddingBottom, 10)
					return {
						item,
						itemStyles,
						paddingTop: paddingTopInt,
						paddingBottom: paddingBottomInt,
						borderBottom
					}
				}))
			})

			return Promise.all(this.measurements)
		},

		mutateItems(items) {
			_.forEach(items, ({ item, itemStyles, paddingTop, paddingBottom, borderBottom }, index) => {
				this.mutations.push(fDOM.mutate(() => {
					if (index === 0 && paddingTop !== 0)  {
						item.style.paddingTop = 0
					}

					if (index !== 0 && paddingTop === 0) {
						item.style.paddingTop = itemStyles.paddingTop
					}

					if (index === (items.length - 1) && (borderBottom !== '' || borderBottom === itemStyles.borderBottom)) {
						item.style.borderBottom = 0
					}

					if (index === (items.length - 1) && paddingBottom !== 0) {
						item.style.paddingBottom = 0
					}

					if (index !== (item.length - 1) && (paddingBottom === 0 || borderBottom === 0)) {
						item.style.paddingBottom = itemStyles.paddingBottom
						item.style.borderBottom = itemStyles.borderBottom
					}
				}))
			})

			return Promise.all(this.mutations)
		},

		getStyleSheetRules(selector) {
			let { styleSheets } = document
			return _.compact(_.map(styleSheets, styleSheet => {
				return _.find((styleSheet.rules || styleSheet.cssRules), declaration => (selector === declaration.selectorText))
			})).pop().style
		},
	},

	filterActiveItems(menuItem) {
		let { isotope, filters, sortOptions } = this.config
>>>>>>> 2eb5d14... major updates

		// Fetch the group filter accordingly
		let group = closest(menuItem, this.menuClass).getAttribute('data-filter-group')

		// Get the filters
		let activeFilters = ''
		filters[group] = menuItem.getAttribute('data-filter')

		// Add filters to the string from the object
		for (let key in filters) {
			activeFilters += filters[key]
		}

		sortOptions = !!sortOptions ? sortOptions : {}
		let config = Object.assign(sortOptions, {
			filter: activeFilters.indexOf('.') > -1 ? activeFilters : '*',
			transitionDuration: 500,
		})

<<<<<<< HEAD
		this.isotope.arrange(config)
		this.isotope.layout()
	},
	
	bindListeners() {
		_.forEach(this.filters, (filter) => {
			filter.addEventListener('click', this.changeActiveElement.bind(this, filter))
			filter.addEventListener('click', this.filterActiveItems.bind(this, filter))
=======
		isotope.arrange(config)

		// Style padding based on filteredItems location
		this.setStylesOnFilter.measureItems(isotope.filteredItems, this.config.selector)
			.then(items => this.setStylesOnFilter.mutateItems(items))
			.then(() => {
				isotope.layout()
				this.mutateFilterOptions(group)
			})
	},

	buildDataTree() {
		this.ui.dropdowns.dataTrees = _.map(this.ui.dropdowns.menus, menu => {
			let menuID = menu.dataset.filterGroup
			let menuItems = [...menu.querySelectorAll(`.${this.itemClass}`)]
			let dataItems = menuItems.map(({ id }) => (id === 'all') ? 'all' : id.split('filter--')[1])
			let dataTree = [{
				name: menuID,
				isActive: false,
			}, {
				active: {},
				inactive: {}
			}]
			_.forEach(dataItems, (item, index) => dataTree[1].active[item] = menuItems[index])
			return dataTree
		})
	},

	resetDataTree(group) {
		_.forEach(this.ui.dropdowns.dataTrees, tree => {
			let inactives = tree[1].inactive
			_.forEach(inactives, (value, key) => {
				value.style.display = 'block'
				tree[1].active[key] = value
				delete tree[1].inactive[key]
			})
		})
	},

	mutateFilterOptions(group) {
		let { dataTrees } = this.ui.dropdowns
		let currentTree = _.findIndex(dataTrees, tree => tree[0].name === group)
		let menu1 = dataTrees[currentTree][0].isActive
		let menu2 = dataTrees[currentTree === 1 ? 0 : 1][0].isActive

		if (menu1 ^ menu2) {
			return false
		}

		this.ui.dropdowns.dataTrees = dataTrees.map(tree => {
			let { name, isActive } = tree[0]
			if (name === group && !isActive) {
				return [
					{
						isActive: true,
						name,
					},
					tree[1]
				]
			}

			else {
				return tree
			}
		})

		this.resetDataTree(group)
		let { filteredItems } = this.config.isotope
		let classNames = [...new Set(
			_.flatten(
				filteredItems.map(({ element }) => {
					let classes = [...element.classList]
					let filters = classes
						.filter(className => className.indexOf('filter') > -1)
						.map(className => className.split('filter--')[1])
					return filters
				})
			)
		)].concat(['all'])
		let siblingDropdown = (_.findIndex(this.ui.dropdowns.dataTrees, tree => tree[0].name === group) === 0)
			? this.ui.dropdowns.dataTrees[1][1]
			: this.ui.dropdowns.dataTrees[0][1]
		let siblingDropdownKeys = Object.keys(siblingDropdown.active)
		let difference = _.difference(siblingDropdownKeys, classNames)
		_.forEach(difference, key => {
			let value = siblingDropdown.active[key]
			delete siblingDropdown.active[key]
			siblingDropdown.inactive[key] = value
			siblingDropdown.inactive[key].style.display = 'none'
>>>>>>> 2eb5d14... major updates
		})
	},

	bindListeners() {

		// Open && Close Menu. Clicking anywhere outside the menu should close it.
		this.menu.addEventListener('click', this.changeMenuState.bind(this))
		document.body.addEventListener('click', this.changeMenuState.bind(this))

		// Listeners for menu item options.
		_.forEach(this.menuItems, menuItem => {
			menuItem.addEventListener('click', this.setActiveMenuItem.bind(this, menuItem))
			menuItem.addEventListener('click', this.filterActiveItems.bind(this, menuItem))
		})

		// Chainable method calls.
		return this
	},
}

<<<<<<< HEAD
export default ({ menu, filters, isotope, sortOptions, filtersObject }) => {
	const { menuClass, activeClass } = els.ui.isotope.dropdowns.classes
=======
export default (config, ui, { menu, menuItems }) => {
	// Do I need the menus reference here?
	const { menus, classes: { menuClass, itemClass, activeMenuClass, activeItemClass }} = ui.dropdowns
>>>>>>> 2eb5d14... major updates
	return Object.assign({
		config,
		ui,
		menu,
		menus,
		menuItems,
		menuClass,
<<<<<<< HEAD
		activeClass }, dropdown)
=======
		itemClass,
		activeMenuClass,
		activeItemClass,
	}, dropdown)
>>>>>>> 2eb5d14... major updates
}
