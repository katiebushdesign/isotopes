/*--------------------------------------------------------*\
	Isotopes
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'
// import buildConfigs from './buildConfig'

<<<<<<< HEAD
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
=======
export default async function() {
	let { configs, ui } = els.isotopes
	configs = configs.filter(config => !!config.container)
	if (configs.length) {
		const isotopes = await import(`./util/isotopes`)
		_.forEach(configs, config => isotopes.default.init(config, ui))
	}
}
>>>>>>> 2eb5d14... major updates
