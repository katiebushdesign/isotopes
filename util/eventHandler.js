/*--------------------------------------------------------*\
	Isotopes ==> Event Handler
\*--------------------------------------------------------*/

import _ from 'lodash'

const eventHandler = {
	add(elements, fn, listeners) {
		_.forEach(elements, (element) => {
			let { id } = element
			let event = 'mouseover'
			element.addEventListener(event, fn)
			listeners.push({ id, element, event, fn })
		})
	},

	remove(listeners) {
		_.forEach(listeners, (listener) => {
			let { element, event, fn } = listener
			element.removeEventListener(event, fn)
		})
	},
}

export default eventHandler
