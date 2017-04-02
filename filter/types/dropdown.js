/*--------------------------------------------------------*\
	Dropdown Filter Type
\*--------------------------------------------------------*/

function dropdown() {

	// Fetch the group filter accordingly
	let group = event.target.parentNode.getAttribute( 'data-filter-group' )

	// Get the filters
	instance.filters[group] = event.target.getAttribute('data-filter')

	// Add them to the string from the object
	for (let key in instance.filters) {
		filters += instance.filters[key]
	}
	
	if (filters === '**') filters = '*'
}

export default dropdown
