/*--------------------------------------------------------*\
	Isotopes
\*--------------------------------------------------------*/

import els from 'els'
import init from './util/init'
import _ from 'lodash'


// experimental
export default async function() {
	let { isotopes } = els
	let { filters } = els.ui.isotope
	let containers = isotopes.filter(isotope => !!isotope.container)

	if (containers.length) {
		const init = await import(`./util/init`)
		_.forEach(isotopes, (config) => {
			let { container, items } = config
			if (items.length && !!container) {
				if (config.sortOnLoad || config.sortOnLoad[0]) {
					init.default.onLoad(config)
				}

				else {
					init.default.onHover(filters, config)
				}
			}
		})
	}
}
