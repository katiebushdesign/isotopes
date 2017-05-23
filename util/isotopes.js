/*--------------------------------------------------------*\
	Isotopes ==> Init

	BUGS: Page still occasionally "jumps" to top
	on hover/init/filter/whatever

	TODO:

	(1) rebuild hash/history functionality; perhaps
	i should store hashes in the UI instance of isotope
	instead of the globals, but that may be unnecessary

	(2) could i just more simply use the native initLayout
	option for this instead of making it so complicated?
\*--------------------------------------------------------*/

import els from 'els'
import isotopeFactory from './factory'
import filter from '../filter'
import eventHandler from './eventHandler'
import _ from 'lodash'

import sizing from './sizing'
import hashLoad from './hashLoad'
import history from './history'

const isotopes = {
	eventHandler: {
		add(fn) {
			let elements = (this.config.filterType === 'dropdown') ? this.ui.dropdowns.menus : this.ui.menus
			this.ui.listeners.push([...elements].map(element => {
				const { id } = this.config
				const event = 'mouseover'
				element.addEventListener(event, fn)
				return { id, element, event, fn }
			})[0])
		},

		remove(id) {
			let listeners = this.ui.listeners.filter(listeners => listeners.id === id)
			_.forEach(listeners, ({ element, event, fn }) => element.removeEventListener(event, fn))
			_.remove(this.ui.listeners, listener => listener.id === id)
		},
	},

	onHover() {
		let { hash } = els
		let { name, touch } = els.browser

		// Don't wait for hover on mobile, touch-enabled devices, οr when a hash-load is active.
		if (
			   name === 'ios'
			|| touch === true
			|| window.innerWidth < 1025
			|| hash !== ''
		) {
			this.onLoad()
		}

		else {
			this.eventHandler.add.call(this, this.onLoad.bind(this))
		}
	},

	onLoad() {
		if (!this.config.isotope) {
			isotopeFactory(this.config)
				.then((config) => {

					// Clear Listeners on elements to prevent re-init
					if (this.ui.listeners) this.eventHandler.remove.call(this, this.config.id)

					// Add active class to Isotope container
					config.container.classList.add('isotope--active')

					// Add filters to Isotope instance
					filter(this.config, this.ui)

					if (config.hasOwnProperty('setSize')) {
						sizing.setSizeOnResize(config)
						return sizing.setSize(config)
					}

					config.isotope.layout()
				})
		}
	},

	init(config, ui) {
		let { sortOnLoad } = config
		this.config = config
		this.ui = ui

		if (sortOnLoad || sortOnLoad[0]) {
			this.onLoad()
		}

		else {
			this.onHover()
		}
	}
}

export default isotopes
