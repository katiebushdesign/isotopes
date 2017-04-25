/*--------------------------------------------------------*\
	Isotope Sizing

	TODO: Add new methods for other mutations (width, etc.)
	getColumnWidth() ?
\*--------------------------------------------------------*/

import _ from 'lodash'
import fastdom from 'fastdom'
import fastdomPromised from 'fastdom/extensions/fastdom-promised'
const fDOM = fastdom.extend(fastdomPromised)

const sizing = {
	state: {
		__height: 0,
		measurements: [],
		mutations: [],
	},

	measureHeight(items) {
		let { __height, measurements } = this.state
		_.forEach(items, (item) => {
			measurements.push(fDOM.measure(() => {
				let { height } = item.getBoundingClientRect()
				if (height > this.state.__height)
					this.state.__height = height

				return item
			}))
		})

		return Promise.all(measurements)
	},

	mutateHeight(items) {
		let { __height, mutations } = this.state
		_.forEach(items, (item) => {
			mutations.push(fDOM.mutate(() => {
				item.style.height = __height + 'px'
			}))
		})

		return Promise.all(mutations)
	},

	setHeight(items, isotope) {
		return this.measureHeight(items)
			.then(items => this.mutateHeight(items))
	},

	setSize({ setSize: options, items }) {
		if (options === 'height') {
			return this.setHeight(items)
		}
	},

	setSizeOnResize({ setSize: options, items }) {
		if (options === 'height') {
			window.addEventListener('resize', _.debounce(this.setHeight.bind(this, items), 150))
		}
	},
}

export default sizing
