/*--------------------------------------------------------*\
	Dropdown Menu Filters && Functionality

	TODO:

	(1) I still need to make an error handler for non-matched
	sorts
	(2) Implement hash state.
	(3) Possibly abstract style method based on some kind
	of options and then style from there. Perhaps the method
	itself could also be used for other configs. (Actually this is probably necessary)
	(4) Split mutate function into separate functions, or maybe even an object?
	(5) Realistically, given the structure, I could use something like
	immutableJS or baobab...it might even be easier. (look at lib size for consideration)
\*--------------------------------------------------------*/

import { closest } from 'util'
import _ from 'lodash'
import fastdom from 'fastdom'
import fastdomPromised from 'fastdom/extensions/fastdom-promised'
const fDOM = fastdom.extend(fastdomPromised)

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

	// Need to turn the other active menu off?
	setActiveMenuItem(menuItem) {
		let group = closest(menuItem, this.menuClass)
		let filterGroup = group.dataset.filterGroup
		// this.ui.dropdowns.trees.map(tree => {
		// 	return (tree.id === filterGroup)
		// 		? Object.assign(tree, { active: true })
		// 		: tree
		// })
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

		isotope.arrange(config)

		// Style padding based on filteredItems location
		this.setStylesOnFilter.measureItems(isotope.filteredItems, this.config.selector)
			.then(items => this.setStylesOnFilter.mutateItems(items))
			.then(() => {
				isotope.layout()
				// this.mutateFilterOptions(group)
			})
	},

	buildDataTree() {
		const id = this.menu.dataset.filterGroup
		let menuItems = [...this.menuItems].filter(({ id }) => id !== 'all')
		let items = menuItems.reduce((obj, item) => Object.assign(obj, {[item.id]: { active: true, item }}), {})
		this.ui.dropdowns.trees.push({
			id,
			active: false,
			items,
		})
	},

	resetDataTree(tree) {
		this.ui.dropdowns.trees = this.ui.dropdowns.trees.map(tree => {
			let items = Object.keys(tree.items).map(key => {
				tree.items[key].item.style.display = ''
				return {
					active: true,
					item: tree.items[key].item
				}
			})

			return Object.assign(tree, { items })
		})
	},

	mutateFilterOptions(group) {
		let { trees } = this.ui.dropdowns

		// Get current && active trees; if all trees are active, return false (don't mutate options)
		let currentTree = _.findIndex(trees, ({ id }) => id === group)
		let activeTrees = trees.map(({ active }) => active)
		if (activeTrees.every(element => element)) {
			return false
		}

		// Fetch all currently filtered Isotope items and reduce them to a flattened array of unique classNames
		let { filteredItems } = this.config.isotope
		let classNames = [...new Set(
			_.flatten(filteredItems.map(({ element: { classList }}) => [...classList].filter(className => className.indexOf('filter') > -1)))
		)]

		// Fetch all non-active trees, reset active trees, and compute the intersection of the filters between the trees
		let siblingDropdowns = this.ui.dropdowns.trees.filter((item, index) => index !== currentTree)
		// _.forEach(siblingDropdowns, tree => this.resetDataTree(tree))
		let siblingDropdownsKeys = siblingDropdowns.map(({ id, items }) => {
			let keys = Object.keys(items).filter(key => items[key].active)
			return { id, keys }
		})
		let differences = siblingDropdownsKeys.map(({ id, keys }) => ({ id, difference: _.difference(keys, classNames) }))

		// Re-map
		this.ui.dropdowns.trees = this.ui.dropdowns.trees.map(tree => {
			return _.first(differences.map(({ id, difference }) => {
				if (tree['id'] === id) {
					let items = Object.keys(tree.items).map(key => {
						if (difference.includes(key)) {
							return {
								active: false,
								item: tree.items[key].item
							}
						}

						else {
							return tree.items[key]
						}
					})

					return { id, active: tree.active, items }
				}

				else {
					return tree
				}
			}))
		})

		// Mutate
		_.forEach(this.ui.dropdowns.trees, tree => {
			_.forEach(tree.items, item => {
				if (!item.active) {
					item.item.style.display = 'none'
				}

				else {
					item.item.style.display = ''
				}
			})
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

		return this
	},
}

export default (config, ui, { menu, menuItems }) => {
	const { menus, classes: { menuClass, itemClass, activeMenuClass, activeItemClass }} = ui.dropdowns
	return Object.assign({
		config,
		ui,
		menu,
		menus,
		menuItems,
		menuClass,
		itemClass,
		activeMenuClass,
		activeItemClass,
	}, dropdown)
}
