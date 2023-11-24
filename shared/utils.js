/**
 * Loop through an Elementor element and apply the function.
 *
 * @param {any} element  Elementor element.
 * @param {*} applyFunc The function to apply on each child element.
 */
const loopElementorElement = ( element, applyFunc ) => {
	applyFunc( element );

	element?.elements?.forEach( ( item ) => {
		loopElementorElement( item, applyFunc );
	} );
};

/**
 * Clean the template content from unnecessary data.
 *
 * @param {any} templateContent The template content.
 * @param {Function} cleanFunc The function to apply on each element.
 * @return {any} The cleaned template content.
 */
export const cleanTemplateContent = ( templateContent, cleanFunc ) => {
	if ( undefined === templateContent.content ) {
		return templateContent;
	}

	console.log( templateContent );

	const content = templateContent.content;

	if ( Array.isArray( content ) ) {
		content.forEach( ( item ) => {
			loopElementorElement( item, cleanFunc );
		} );
	}
};
