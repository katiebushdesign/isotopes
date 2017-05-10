/*--------------------------------------------------------*\
	Load Posts Listener
\*--------------------------------------------------------*/

function bindListener(listener, config) {
	listener.addEventListener('click', addPosts.bind(listener, config))
}

function addPosts(config) {
	let storedPosts = window.localStorage.getItem(config.loader.storage)
	let { posts, time } = JSON.parse(storedPosts)
	let nodes = posts.splice(0, 10)
		.reduce((arr, post) => {
			let div = document.createElement('div')
			div.innerHTML = post
			return arr.concat(div.firstChild)
		}, [])
	config.isotope.insert(nodes)
	
	// Reset Data
	const updatedData = { posts, time }	
	window.localStorage.setItem(config.loader.storage, JSON.stringify(updatedData))

	// Remove Listener
	if (posts.length === 0) {
		this.parentNode.removeChild(this)
	}
}

function loadPosts(listener, config) {
	bindListener(listener, config)
}

export default loadPosts
