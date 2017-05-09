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
// import getPosts from './getPosts'
// import loadPosts from './loadPosts'
// import parsePosts from './parsePosts'

function loader(config) {
	let { loader: { count, action }} = config
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

	.then((posts) => {
		let nodes = JSON.parse(posts)
			.reduce((arr, post) => {
				let div = document.createElement('div')
				div.innerHTML = post
				return arr.concat(div.firstChild)
			}, [])
		config.isotope.insert(nodes)
	})
}

export default loader
