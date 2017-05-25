/*--------------------------------------------------------*\
	Isotopes
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'
// import buildConfigs from './buildConfig'

export default async function() {
	let { configs, ui } = els.isotopes
	configs = configs.filter(config => !!config.container)
	if (configs.length) {
		const isotopes = await import(`./util/isotopes`)
		_.forEach(configs, config => isotopes.default.init(config, ui))
	}
}
