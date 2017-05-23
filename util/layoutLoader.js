/*--------------------------------------------------------*\
	Import Isotope Layout Extras
\*--------------------------------------------------------*/

async function layoutLoader(layout) {
	let IsotopeLayoutLib = null
	switch (layout) {
		case 'packery':
			IsotopeLayoutLib = await import('isotope-packery')
			return IsotopeLayoutLib
		case 'masonryHorizontal':
			IsotopeLayoutLib = await import('isotope-masonry-horizontal')
			return IsotopeLayoutLib
		case 'horiz':
			IsotopeLayoutLib = await import('isotope-horizontal')
			return IsotopeLayoutLib
		case 'fitColumns':
			IsotopeLayoutLib = await import('isotope-fit-columns')
			return IsotopeLayoutLib
		case 'cellsByColumn':
			IsotopeLayoutLib = await import('isotope-cells-by-column')
			return IsotopeLayoutLib
	}
}

export default layoutLoader
