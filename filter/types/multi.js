/*--------------------------------------------------------*\
	Multi-sort Filter Type

	TODO: Rename to 'checkbox'
\*--------------------------------------------------------*/

import { includes } from 'lodash'
import { toArray } from 'lodash'
import permute from 'util'
import closest from 'util'

function multi(instance, filterItems) {

	// Define filters && get value
	let filters = ''
	let value = this.value

	// Fetch the group filter accordingly
	let group = closest(this, 'filter__group').getAttribute('data-filter-group')

	// Clear relevant filters
	if (group === 'group__topLevel' || group == null) {
		instance.filters = {}
		for (let i = 0; i < filterItems.length; i++) {
			if (filterItems[i] !== this) {
				filterItems[i].checked = false
			}
		}
	}

	if (this.checked) {

		// If the object already has a value for that group, add it to the existing array
		if ( group !== 'group__topLevel' && _.includes( Object.keys(instance.filters), group ) ) {
			instance.filters[ group ].push( value )
		}
		
		// If the group does not yet exist, init an empty array and add it to the array
		else {
			instance.filters[ group ] = []
			instance.filters[ group ].push( value )
		}
	} else {

		// If the group has multiple values, find the value and remove it from the array
		if ( instance.filters[ group ].length > 1 ) {
			let i = instance.filters[ group ].indexOf( value )
			instance.filters[ group ].splice(i, 1)
		}

		// If the group only has one value, just delete the group altogether
		else {
			delete instance.filters[ group ]
		}
	}

	// Check if filters object is empty
	if ( JSON.stringify( instance.filters ) != '{}' ) {

		// Run permutation on the object converted to an array
		let results = permute(_.toArray( instance.filters ))

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

	return filters
}

export default multi
