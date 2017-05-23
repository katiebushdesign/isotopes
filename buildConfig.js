/*--------------------------------------------------------*\
	Build Isotope Config
\*--------------------------------------------------------*/

import els from 'els'
import _ from 'lodash'

function buildConfigs(configs) {
	return configs.map(config => {
		const { id } = config
		const container = document.getElementById(`container--${id}`)
		const items = document.getElementsByClassName(`${id}__item`)
		const selector = `.${id}__item`

		return Object.assign({
			container,
			items,
			selector
		}, config)
	})
}

export default buildConfigs
