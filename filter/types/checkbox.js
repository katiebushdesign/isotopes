/*--------------------------------------------------------*\
	Multi-sort Filter Type

	TODO: Rename to 'checkbox'
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'
import { permute } from 'util'
import { closest } from 'util'

function getMenu() {
	let {
		ui: {
			isotope: {
				checkboxes: { menuButton, sidebar, closeButton }
			}
		}
	} = els
	menuButton.addEventListener('click', () => sidebar.classList.add('sidebar--open'))
	closeButton.addEventListener('click', () => sidebar.classList.remove('sidebar--open'))
}

function checkbox(filtersObject, isotope, loader) {

	// Load all Posts if not yet loaded
	// TODO: Abstract this.
	let { posts, time } = JSON.parse(window.localStorage.getItem(loader.storage))
	if (posts.length !== 0) {
		let nodes = posts.splice(0, posts.length)
			.reduce((arr, post) => {
				let div = document.createElement('div')
				div.innerHTML = post
				return arr.concat(div.firstChild)
			}, [])
		isotope.insert(nodes)
		
		// Reset Data
		const updatedData = { posts, time }	
		window.localStorage.setItem(loader.storage, JSON.stringify(updatedData))
		loader.button.parentNode.removeChild(loader.button)
	}

	// Define filters && get value
	let filters = ''
	let value = this.value

	// Fetch the group filter accordingly
	let group = closest(this, 'filter__list').getAttribute('data-filter-group')

	// Clear relevant filters
	// if (group === 'group__topLevel' || group == null) {
	// 	filtersObject = {}
	// 	for (let i = 0; i < filterItems.length; i++) {
	// 		if (filterItems[i] !== this) {
	// 			filterItems[i].checked = false
	// 		}
	// 	}
	// }

	if (this.checked) {

		// If the object already has a value for that group, add it to the existing array
		if ( group !== 'group__topLevel' && _.includes( Object.keys(filtersObject), group ) ) {
			filtersObject[ group ].push( value )
		}
		
		// If the group does not yet exist, init an empty array and add it to the array
		else {
			filtersObject[ group ] = []
			filtersObject[ group ].push( value )
		}
	} else {

		// If the group has multiple values, find the value and remove it from the array
		if ( filtersObject[ group ].length > 1 ) {
			let i = filtersObject[ group ].indexOf( value )
			filtersObject[ group ].splice(i, 1)
		}

		// If the group only has one value, just delete the group altogether
		else {
			delete filtersObject[ group ]
		}
	}

	// Check if filters object is empty
	if ( JSON.stringify( filtersObject ) != '{}' ) {

		console.log(_.toArray( filtersObject ))

		// Run permutation on the object converted to an array
		let results = permute(_.toArray( filtersObject ))

		// For each array in results, join into a selector string
		results.forEach((r, i) => {
			if ((i + 1) == results.length) {
				filters += r.join('')
			} 

			else {

				// Add a comma after each selector string unless it's the last string
				filters += r.join('') + ', '
			}
		})
	} 

	else {
		filters = '*:not(.filter--not-all)'
	}

	let config = Object.assign({}, {
		filter: filters.indexOf('.') > -1 ? filters : '*',
		transitionDuration: 500,
	})

	isotope.arrange(config)
}

export { getMenu }
export default checkbox
