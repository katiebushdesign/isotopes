/*--------------------------------------------------------*\
	Isotope ==> Hash On Load

	TODO: Maybe refactor this a bit.
	TODO: use 'onhashchange' event!
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'
import { scrollTo } from 'util/index'
import { closest } from 'util/index'

function hashLoad(config, hash, filters) {
	let { isotope, sortOptions, container } = config
	let block = container.id
		.split('--')
		.filter(id => id !== 'container')
		.map(id => `block--${id}`)
	block = _.head(block)
	let verified = Array.from(filters).filter(filter => filter.id.indexOf(hash.split('#')[1]) > -1)
	let hashFilter = hash.split('#')[1]

	if (verified.length) {

		// TODO: I need to remove the currently active class here or somewhere?

		// Set active class on hashed filter__item
		verified.map((filter) => filter.classList.add('filter__item--active'))

		// Merge config/options
		let filter = `.filter--${hashFilter}`
		let options = Object.assign(config, { filter })

		// Scroll to Isotope Block after Layout
		isotope.once('layoutComplete', scrollTo(closest(container, block)))

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
