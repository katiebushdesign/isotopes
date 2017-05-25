/*--------------------------------------------------------*\
	Isotope => Filter Hash onLoad
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'
import { scrollTo } from 'util/index'
import { closest } from 'util/index'

function hashLoad(config, ui, hash) {
	let { isotope, sortOptions, container, filterType } = config
	let block = container.id
		.split('--')
		.filter(id => id !== 'container')
		.map(id => `block--${id}`)
		.pop()
	let hashFilter = hash.split('#')[1]
	let filterItem = [...ui.filters].filter(({ id }) => id.indexOf(hashFilter) > -1).pop()

	if (!!filterItem) {

		// Set active class on hashed filter__item
		if (filterType === 'menu') {
			[...ui.filters].map(item => {
				if (filterItem !== item) {
					item.classList.remove('filter__item--active')
				}

				else {
					item.classList.add('filter__item--active')
				}
			})
		}

		else if (filterType === 'dropdown') {
			let { instances, classes: { menuClass }} = ui.dropdowns
			let { id } = closest(filterItem, menuClass)
			let menu = instances.filter(({ menu }) => id === menu.id).pop()
			menu.setActiveMenuItem(filterItem)
		}

		// Merge config/options
		let filter = `.filter--${hashFilter}`
		let options = Object.assign(config, { filter })

		// Scroll to Isotope Block after Layout
		if (block !== document.getElementsByClassName('block')[0].id) {
			isotope.once('layoutComplete', scrollTo(closest(container, block)))
		}

		// Sort / Layout
		isotope.arrange(options)
		isotope.layout()

		// Modify
		let path = els.pathname.split('/').filter(item => item != '').shift()
		history.replaceState({ filter, path }, null, hash)
	}

	else {
		window.location.hash = ''
		console.error('Isotope autosort has failed or URL was passed invalid hash.')
		return false
	}
}

export default hashLoad
