/*--------------------------------------------------------*\
	Isotopes ==> Init

	BUGS: Page still occasionally "jumps" to top
	on hover/init/filter/whatever
\*--------------------------------------------------------*/

import els from 'els'
import isotopeFactory from './factory'
import filter from '../filter'
import eventHandler from './eventHandler'
import _ from 'lodash'

import sizing from './sizing'
import hashLoad from './hashLoad'
import history from './history'

const init = {
	onHover(filters, config) {
		let { hash } = els
		let { name, touch } = els.browser
		let { listeners } = els.ui.isotope
		
		// Don't wait for hover on mobile, touch-enabled devices, οr when a hash-load is active.
		if (
			   name === 'ios' 
			|| touch === true 
			|| window.innerWidth < 1025 
			|| hash !== ''
		) {
			this.onLoad(config)
		}

		else {
			eventHandler.add(filters, this.onLoad.bind(null, config), listeners)
		}
	},

	onLoad(config) {
		let { hash, history: state } = els
		let { filters } = els.ui.isotope
		let { isotope, container } = config
		
		if (!isotope) {
			isotopeFactory(config)
				.then((config) => {

					// Clear Listeners on elements to prevent re-init
					let { listeners } = els.ui.isotope
					if (listeners) {
						eventHandler.remove(listeners)
					}

					// Add active class to Isotope container
					config.container.classList.add('isotope__container--active')

					// Add filters to Isotope instance
					filter(config)

					if (config.hasOwnProperty('setSize')) {
						return sizing.setSize(config) 
					}
					
					config.isotope.layout()
			
				}).then(() => {
					if (hash !== '') {
						hashLoad(config, hash, filters)

						window.addEventListener('popstate', (event) => console.log(event))
					}

					else if (state) {
						history(config)
					}

					config.isotope.layout()
				})
		}
	},
}

export default init
