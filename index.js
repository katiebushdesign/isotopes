/*--------------------------------------------------------*\
	Isotopes
\*--------------------------------------------------------*/

import els from 'els'
import init from './util/init'
import _ from 'lodash'

export default(() => {
	let { isotopes } = els
	let { filters } = els.ui.isotope

	_.forEach(isotopes, (config) => {
		let { container, items } = config
		if (items.length && !!container) {
			if (config.sortOnLoad) {
				init.onLoad(config)
			}

			else {
				init.onHover(filters, config)
			}
		}
	})
})
