/*--------------------------------------------------------*\
	Isotope Sorting Config
\*--------------------------------------------------------*/

const isotopeSort = {
	sortByDate(selector, sortAscending = false) {
		return {
			sortBy: 'date',
			sortAscending,
			getSortData: {
				date: (element) => Date.parse(element.querySelector(selector).textContent)
			}
		}
	},

	sortByTitle(selector, sortAscending = true) {
		return {
			sortBy: 'title',
			sortAscending,
			getSortData: {
				title: (element) => element.querySelector(selector).textContent
			}
		}
	},

	sortByDataAttr(selector, sortAscending = false) {
		return {
			sortBy: 'data',
			sortAscending,
			getSortData: {
				data: selector,
			}
		}
	},

	init({ method, selector, sortAscending }) {
		if (method === 'date') {
			return this.sortByDate(selector, sortAscending)
		}

		if (method === 'title') {
			return this.sortByTitle(selector, sortAscending)
		}

		if (method === 'data') {
			return this.sortByDataAttr(selector, sortAscending)
		}
	},
}

export default isotopeSort
