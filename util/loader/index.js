/*--------------------------------------------------------*\
	Load More

	TODO:
	// 1. localstorage save/load
	// 2. instaload
	// 3. isotope of pure html
	// 4. needs to be purely functional
	// 5. possibly put event listener inside function?
	// 6. loop through loadMore array so that it's functional
\*--------------------------------------------------------*/


import els from 'els'
import request from 'superagent'
import loadPosts from './loadPosts'

function loader(config, listener) {
	let { loader: { count, action, storage }} = config
	
	// Has data changed?
	let saved = JSON.parse(window.localStorage.getItem(storage))
	let currentTime = (new Date()).getTime()
	let lastSaved = (saved === null) ? 0 : saved.time
	let dt = (currentTime - lastSaved) / (1000 * 60)

	// Request
	let req = new Promise((resolve, reject) => {
		request
			.post(ajaxurl)
			.send({ action })
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.end((err, res) => {

				// TODO: write real errors to DOM // console
				if (err) {
					reject(err)
				} else {
					resolve(res.text)
				}
			})
	})
	
	.then((res) => {

		// Maybe I should convert this to a List to check exact equality???
		if (res) {
			
			// Get current data if request is made
			let current = JSON.parse(res)
			
			// Don't update if data has not changed
			if (saved === null || saved.length !== current.length) {

				const data = {
					posts: current,
					time: currentTime,
				}
				
				// Set localStorage
				window.localStorage.setItem(storage, JSON.stringify(data))
			}
		}

		return loadPosts(listener, config)
	})
}

export default loader
