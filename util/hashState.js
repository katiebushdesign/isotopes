/*--------------------------------------------------------*\
	Hash State => Store filters via History API
\*--------------------------------------------------------*/

export default function hashState(pathname) {
	let id = `#${this.id.split('filter--')[1]}`
	let activeHash = (id === '#all') ? null : id
	let path = pathname.split('/').filter(item => item != '').shift()
	history.pushState({ filter: activeHash, path }, null, activeHash)	
}
